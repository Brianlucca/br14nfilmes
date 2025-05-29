import React, { useState, useEffect, useContext, useRef } from "react";
import {
  ref,
  onValue,
  push,
  serverTimestamp,
  get,
  update,
  remove,
  runTransaction,
  onDisconnect,
  set,
} from "firebase/database";
import { database } from "../../services/firebaseConfig/FirebaseConfig";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Send,
  UserCircle,
  X,
  MessageSquareQuote,
  SmilePlus,
  ThumbsUp,
  Trash2,
  Edit3,
  MoreHorizontal,
  CornerUpLeft,
  CircleDot,
  Check,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import ReactMarkdown from "react-markdown";
import "react-toastify/dist/ReactToastify.css";

const MESSAGE_LIMIT = 10;
const TIME_WINDOW_MS = 60000;
const MAX_CHAT_CHARS = 320;
const WARNING_BANNER_DISMISSED_KEY = "chatWarningBannerDismissed_v1";
const TYPING_TIMEOUT_MS = 3000;

// --- YOUTUBE VIDEO ID EXTRACTOR (Existing) ---
const getYouTubeVideoId = (url) => {
  if (!url || typeof url !== "string") {
    return null;
  }
  let videoId = null;
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      videoId = match[1];
      break;
    }
  }
  if (!videoId) {
    try {
      const parsedUrl = new URL(url);
      // This specific googleusercontent URL pattern for YouTube is quite unusual.
      // Standard YouTube embeds are typically youtube.com/embed/VIDEO_ID
      if (
        parsedUrl.hostname.includes("googleusercontent.com/youtube.com") &&
        parsedUrl.searchParams.has("v")
      ) {
        const vParam = parsedUrl.searchParams.get("v");
        if (vParam && vParam.length === 11) {
          videoId = vParam;
        }
      }
    } catch (e) {
      // URL parsing failed, not a valid URL or format not recognized by this specific check
    }
  }
  return videoId;
};

// --- NEW: GOOGLE DRIVE FILE ID EXTRACTOR ---
const getGoogleDriveFileId = (url) => {
  if (!url || typeof url !== "string") {
    return null;
  }
  let fileId = null;
  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/, // Matches drive.google.com/file/d/FILE_ID/...
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/, // Matches drive.google.com/open?id=FILE_ID
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      fileId = match[1];
      break;
    }
  }
  return fileId;
};

const ChatSession = ({ sessionCode }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const [userPhotoURL, setUserPhotoURL] = useState(null);
  const [sending, setSending] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [charsLeft, setCharsLeft] = useState(MAX_CHAT_CHARS);
  const [showWarningBanner, setShowWarningBanner] = useState(false);

  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const emojiPickerRef = useRef(null);

  const [typingUsers, setTypingUsers] = useState({});
  const typingTimeoutRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    const isDismissed = localStorage.getItem(WARNING_BANNER_DISMISSED_KEY);
    if (isDismissed !== "true") {
      setShowWarningBanner(true);
    }
  }, []);

  const dismissWarningBanner = () => {
    localStorage.setItem(WARNING_BANNER_DISMISSED_KEY, "true");
    setShowWarningBanner(false);
  };

  useEffect(() => {
    setCharsLeft(MAX_CHAT_CHARS - newMessage.length);
  }, [newMessage]);

  useEffect(() => {
    if (messagesEndRef.current && !editingMessage) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, editingMessage]);

  useEffect(() => {
    if (!user) {
      toast.error("Você precisa estar logado para acessar o chat.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDbRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userDbRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const userNickname =
            userData.updateNick?.[user.uid]?.nickname ||
            userData.nickname ||
            `Usuário-${user.uid.substring(0, 5)}`;
          setNickname(userNickname);
          setUserPhotoURL(userData.photoURL || user.photoURL || null);
        } else {
          toast.info(
            "Você precisa definir um nickname no seu perfil para usar o chat.",
          );
          navigate("/profile", {
            state: { from: location.pathname, needsNickname: true },
          });
        }
      } catch (error) {
        toast.error("Erro ao buscar dados do seu perfil.");
      }
    };
    fetchUserData();
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    if (!sessionCode || !user?.uid || !nickname) return;

    const messagesRef = ref(database, `sessions/${sessionCode}/messages`);
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        const messagesArray = Object.keys(messagesData)
          .map((key) => ({
            id: key,
            ...messagesData[key],
          }))
          .sort((a, b) =>
            a.timestamp && b.timestamp
              ? new Date(a.timestamp) - new Date(b.timestamp)
              : 0,
          );
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });

    const typingRef = ref(database, `sessions/${sessionCode}/typing`);
    const unsubscribeTyping = onValue(typingRef, (snapshot) => {
      const typingData = snapshot.val() || {};
      setTypingUsers(typingData);
    });

    const presenceRef = ref(
      database,
      `sessions/${sessionCode}/presence/${user.uid}`,
    );
    const connectedRef = ref(database, ".info/connected");

    const userPresencePath = `sessions/${sessionCode}/presence/${user.uid}`;
    const userTypingPath = `sessions/${sessionCode}/typing/${user.uid}`;

    const unsubscribePresence = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        set(ref(database, userPresencePath), {
          nickname,
          online: true,
          timestamp: serverTimestamp(),
        });
        onDisconnect(ref(database, userPresencePath)).remove();
        onDisconnect(ref(database, userTypingPath)).remove();
      }
    });

    const allPresenceRef = ref(database, `sessions/${sessionCode}/presence`);
    const unsubscribeAllPresence = onValue(allPresenceRef, (snapshot) => {
      setOnlineUsers(snapshot.val() || {});
    });

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      unsubscribePresence();
      unsubscribeAllPresence();
      remove(ref(database, userTypingPath)).catch(() => {});
      remove(ref(database, userPresencePath)).catch(() => {});
    };
  }, [sessionCode, user?.uid, nickname]);

  const updateTypingStatus = (isTyping) => {
    if (!user || !sessionCode || !nickname) return;
    const userTypingRef = ref(
      database,
      `sessions/${sessionCode}/typing/${user.uid}`,
    );
    if (isTyping) {
      set(userTypingRef, { nickname, timestamp: Date.now() });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        remove(userTypingRef);
      }, TYPING_TIMEOUT_MS);
    } else {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      remove(userTypingRef);
    }
  };

  const handleSend = async () => {
    if (!user) {
      toast.warn("Você precisa estar logado para enviar mensagens.");
      return;
    }
    if (!nickname) {
      toast.info("Defina um nickname no seu perfil para enviar mensagens.");
      navigate("/profile", {
        state: { from: location.pathname, needsNickname: true },
      });
      return;
    }

    let textToSend = editingMessage ? editingMessage.text : newMessage;
    const trimmedMessage = textToSend.trim();

    if (!trimmedMessage || trimmedMessage.length > MAX_CHAT_CHARS) {
      if (trimmedMessage.length > MAX_CHAT_CHARS) {
        toast.error(
          `A mensagem excede o limite de ${MAX_CHAT_CHARS} caracteres.`,
        );
      }
      return;
    }

    if (!editingMessage) {
      const currentTime = Date.now();
      const userMessagesInWindow = messages.filter(
        (msg) =>
          msg.userId === user.uid &&
          msg.timestamp &&
          currentTime - new Date(msg.timestamp).getTime() < TIME_WINDOW_MS &&
          !msg.isDeleted,
      );

      if (userMessagesInWindow.length >= MESSAGE_LIMIT) {
        const lastUserMessageTime = new Date(
          userMessagesInWindow[userMessagesInWindow.length - 1].timestamp,
        ).getTime();
        const timeLeft = Math.round(
          (TIME_WINDOW_MS - (currentTime - lastUserMessageTime)) / 1000,
        );
        toast.warn(
          `Você enviou muitas mensagens! Tente novamente em ${timeLeft > 0 ? timeLeft : 1} segundos.`,
        );
        return;
      }
    }

    setSending(true);
    updateTypingStatus(false);

    if (editingMessage) {
      try {
        const messageRef = ref(
          database,
          `sessions/${sessionCode}/messages/${editingMessage.id}`,
        );
        await update(messageRef, {
          text: trimmedMessage,
          isEdited: true,
          editedTimestamp: serverTimestamp(),
        });
        setNewMessage("");
        setEditingMessage(null);
      } catch (error) {
        toast.error("Erro ao editar mensagem.");
      } finally {
        setSending(false);
      }
    } else {
      const messageData = {
        userId: user.uid,
        userName: nickname,
        userPhotoURL: userPhotoURL,
        text: trimmedMessage,
        timestamp: serverTimestamp(),
        reactions: {},
      };
      if (replyingToMessage) {
        messageData.replyingTo = {
          messageId: replyingToMessage.id,
          originalTextSnippet:
            replyingToMessage.text.substring(0, 50) +
            (replyingToMessage.text.length > 50 ? "..." : ""),
          originalSender: replyingToMessage.userName,
        };
      }

      try {
        const sessionMessagesRef = ref(
          database,
          `sessions/${sessionCode}/messages`,
        );
        await push(sessionMessagesRef, messageData);
        setNewMessage("");
        setReplyingToMessage(null);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      } catch (error) {
        toast.error("Erro ao enviar mensagem.");
      } finally {
        setSending(false);
      }
    }
  };

  const handleTextareaInput = (e) => {
    const currentMessage = e.target.value;
    if (editingMessage) {
      if (currentMessage.length <= MAX_CHAT_CHARS + 20) {
        setEditingMessage((prev) => ({ ...prev, text: currentMessage }));
      }
    } else {
      if (currentMessage.length <= MAX_CHAT_CHARS + 20) {
        setNewMessage(currentMessage);
        if (currentMessage.trim().length > 0) {
          updateTypingStatus(true);
        } else {
          updateTypingStatus(false);
        }
      }
    }
    if (e.target) {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const messageRef = ref(
        database,
        `sessions/${sessionCode}/messages/${messageId}`,
      );
      await update(messageRef, {
        text: "[mensagem excluída]",
        isDeleted: true,
        reactions: null,
        replyingTo: null,
      });
      setActiveMessageMenu(null);
    } catch (error) {
      toast.error("Erro ao excluir mensagem.");
    }
  };

  const handleEditAction = (message) => {
    setEditingMessage({ id: message.id, text: message.text });
    setNewMessage("");
    setReplyingToMessage(null);
    setActiveMessageMenu(null);
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
        textareaRef.current.value = message.text;
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }, 0);
    }
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    if (textareaRef.current) {
      textareaRef.current.value = newMessage;
      textareaRef.current.style.height = "auto";
    }
  };

  const handleReplyAction = (message) => {
    setReplyingToMessage(message);
    setEditingMessage(null);
    setActiveMessageMenu(null);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingToMessage(null);
  };

  const onEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    if (editingMessage) {
      setEditingMessage((prev) => ({ ...prev, text: prev.text + emoji }));
    } else {
      setNewMessage((prev) => prev + emoji);
    }
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleReaction = async (messageId, emoji) => {
    if (!user) return;

    try {
      await runTransaction(
        ref(
          database,
          `sessions/${sessionCode}/messages/${messageId}/reactions/${emoji}`,
        ),
        (currentReactionsOnEmoji) => {
          if (!currentReactionsOnEmoji) {
            currentReactionsOnEmoji = {};
          }
          if (currentReactionsOnEmoji[user.uid]) {
            delete currentReactionsOnEmoji[user.uid];
          } else {
            currentReactionsOnEmoji[user.uid] = true;
          }
          return currentReactionsOnEmoji;
        },
      );
    } catch (error) {
      toast.error("Erro ao reagir à mensagem.");
    }
    setActiveMessageMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        if (
          !event.target.closest ||
          !event.target.closest(".emoji-toggle-button")
        ) {
          setShowEmojiPicker(false);
        }
      }
      if (
        activeMessageMenu &&
        !event.target.closest(".message-menu-container") &&
        !event.target.closest(".message-actions-trigger")
      ) {
        setActiveMessageMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMessageMenu]);

  const renderMessageContent = (text, isDeleted) => {
    if (isDeleted) {
      return (
        <p className="text-sm italic leading-relaxed break-words whitespace-pre-wrap py-1 text-gray-400">
          {text}
        </p>
      );
    }

    const textElementForMarkdown = (
      <div className="text-sm leading-relaxed break-words whitespace-pre-wrap py-1 prose prose-sm prose-invert max-w-none">
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline"
              />
            ),
            p: ({ node, ...props }) => <span {...props} />,
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );

    const youtubeVideoId = getYouTubeVideoId(text);
    const googleDriveFileId = getGoogleDriveFileId(text);

    if (youtubeVideoId) {
      return (
        <>
          <div className="my-2">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-600 bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeVideoId}`} 
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          {textElementForMarkdown}
        </>
      );
    } else if (googleDriveFileId) {
      return (
        <>
          <div className="my-2">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-600 bg-black">
              <iframe
                className="w-full h-full"
                src={`https://drive.google.com/file/d/${googleDriveFileId}/preview`}
                title="Google Drive video player"
                frameBorder="0"
                allow="autoplay; encrypted-media;"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          {textElementForMarkdown}{" "}
        </>
      );
    }

    const imageRegex = /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i;
    const isImageLink =
      imageRegex.test(text) &&
      (text.startsWith("http://") || text.startsWith("https://"));
    if (isImageLink) {
      return (
        <>
          <a
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            className="block my-2"
          >
            <img
              src={text}
              alt="Imagem compartilhada"
              className="max-w-full h-auto rounded-md border border-gray-600 bg-black"
              style={{ maxHeight: "300px", display: "block" }}
            />
          </a>
          {textElementForMarkdown}
        </>
      );
    }

    try {
      const url = new URL(text);
      if (
        (url.protocol === "http:" || url.protocol === "https:") &&
        text.match(
          /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
        )?.[0] === text
      ) {
        return (
          <a
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-sky-300 hover:underline break-all"
          >
            {text}
          </a>
        );
      }
    } catch (_) {
    }

    return textElementForMarkdown;
  };

  const currentTypingUsers = Object.entries(typingUsers)
    .filter(
      ([uid, data]) =>
        uid !== user?.uid &&
        data.timestamp &&
        Date.now() - data.timestamp < TYPING_TIMEOUT_MS + 500,
    )
    .map(([_, data]) => data.nickname);

  return (
    <div className="flex flex-col h-full bg-[#101014] text-gray-200">
      <style>{`
        .chat-messages-scrollbar::-webkit-scrollbar { width: 6px; }
        .chat-messages-scrollbar::-webkit-scrollbar-track { background: #18181b; border-radius: 10px; }
        .chat-messages-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
        .chat-messages-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }
        .custom-scrollbar-thin::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar-thin::-webkit-scrollbar-track { background: #27272a; border-radius: 10px; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb { background: #52525b; border-radius: 10px; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #71717a; }
        .prose { color: inherit; }
        .prose strong { color: inherit; }
        .prose em { color: inherit; }
        .prose code { color: #f0f0f0; background-color: #3a3a3e; padding: 0.1em 0.3em; border-radius: 4px; font-size: 0.9em;}
        .prose code::before, .prose code::after { content: ""; }
      `}</style>

      {showWarningBanner && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 text-yellow-300 p-3 text-xs sm:text-sm flex flex-col sm:flex-row justify-between items-center">
          <p className="text-center sm:text-left mb-2 sm:mb-0 sm:mr-4">
            <span className="font-semibold">Aviso:</span> Este é um projeto para
            fins de estudo. Não compartilhe informações pessoais sensíveis. Você
            pode compartilhar links do YouTube, Google Drive, imagens e outras URLs. (Obs: Links de videos do Youtube e Google Drive é renderizado para rodar no chat)
          </p>
          <button
            onClick={dismissWarningBanner}
            className="bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-200 p-1.5 rounded-md flex-shrink-0"
            aria-label="Fechar aviso"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex-grow overflow-y-auto p-4 space-y-1 chat-messages-scrollbar">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.userId === user?.uid;
          const showOnlineIndicator =
            onlineUsers[msg.userId]?.online && !isCurrentUser;

          return (
            <div
              key={msg.id}
              className={`group relative flex items-end gap-2.5 ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              {!isCurrentUser && (
                <div className="relative self-start flex-shrink-0">
                  {msg.userPhotoURL ? (
                    <img
                      src={msg.userPhotoURL}
                      alt={msg.userName}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-gray-700"
                    />
                  ) : (
                    <UserCircle
                      size={30}
                      className="text-gray-600 sm:w-8 sm:h-8 w-7 h-7"
                    />
                  )}
                  {showOnlineIndicator && (
                    <CircleDot
                      size={10}
                      className="absolute bottom-0 right-0 text-green-500 bg-[#101014] rounded-full"
                    />
                  )}
                </div>
              )}
              <div
                className={`relative p-2.5 pt-2 pb-1.5 rounded-xl max-w-[85%] sm:max-w-[75%] md:max-w-[70%] shadow-md ${
                  isCurrentUser
                    ? "bg-sky-900 text-white rounded-br-none"
                    : "bg-[#2a2a2e] text-gray-100 rounded-bl-none border border-gray-700"
                }`}
              >
                {activeMessageMenu === msg.id && !msg.isDeleted && (
                  <div className="message-menu-container absolute z-10 top-0 transform -translate-y-full -mt-1 right-0 bg-[#3a3a3e] border border-gray-600 rounded-md shadow-lg overflow-hidden flex">
                    <button
                      onClick={() => handleReplyAction(msg)}
                      title="Responder"
                      className="p-1.5 hover:bg-gray-600/50 text-gray-300 hover:text-sky-400"
                    >
                      <CornerUpLeft size={16} />
                    </button>
                    <button
                      onClick={() => handleReaction(msg.id, "👍")}
                      title="Curtir"
                      className="p-1.5 hover:bg-gray-600/50 text-gray-300 hover:text-yellow-400"
                    >
                      <ThumbsUp size={16} />
                    </button>
                    {isCurrentUser && (
                      <button
                        onClick={() => handleEditAction(msg)}
                        title="Editar"
                        className="p-1.5 hover:bg-gray-600/50 text-gray-300 hover:text-green-400"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                    {isCurrentUser && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        title="Excluir"
                        className="p-1.5 hover:bg-gray-600/50 text-gray-300 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )}

                {!msg.isDeleted && (
                  <button
                    className="message-actions-trigger absolute top-1 right-1 p-0.5 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity bg-black/10 hover:bg-black/20"
                    onClick={() =>
                      setActiveMessageMenu(
                        activeMessageMenu === msg.id ? null : msg.id,
                      )
                    }
                    aria-label="Mais opções"
                  >
                    <MoreHorizontal
                      size={14}
                      className={
                        isCurrentUser ? "text-sky-200/80" : "text-gray-400"
                      }
                    />
                  </button>
                )}

                {!isCurrentUser && !msg.isDeleted && (
                  <p
                    className={`text-xs font-semibold mb-0.5 ${isCurrentUser ? "text-sky-100" : "text-sky-400"}`}
                  >
                    {msg.userName || "Usuário"}
                  </p>
                )}
                {msg.replyingTo && !msg.isDeleted && (
                  <div className="mb-1 p-1.5 border-l-2 border-sky-400/50 bg-black/20 rounded-sm text-xs">
                    <p className="font-semibold text-sky-300/80">
                      {msg.replyingTo.originalSender}
                    </p>
                    <p className="text-gray-400/90 truncate">
                      {msg.replyingTo.originalTextSnippet}
                    </p>
                  </div>
                )}
                {renderMessageContent(msg.text, msg.isDeleted)}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex space-x-1.5">
                    {msg.reactions &&
                      Object.entries(msg.reactions).map(
                        ([emoji, usersWhoReacted]) => {
                          const userIds = Object.keys(usersWhoReacted || {});
                          if (userIds.length === 0) return null;
                          const currentUserReacted =
                            user?.uid && userIds.includes(user.uid);
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(msg.id, emoji)}
                              className={`px-1.5 py-0.5 text-xs rounded-full border ${currentUserReacted ? "bg-sky-500/30 border-sky-500 text-sky-200" : "bg-gray-600/50 border-gray-500/70 text-gray-300 hover:border-gray-400"}`}
                            >
                              {emoji} {userIds.length}
                            </button>
                          );
                        },
                      )}
                  </div>
                  <div className="flex items-center">
                    {msg.isEdited && !msg.isDeleted && (
                      <span className="text-[9px] text-gray-400/70 mr-1">
                        (editado)
                      </span>
                    )}
                    <p
                      className={`text-[10px] ${isCurrentUser ? "text-sky-200/80" : "text-gray-500"}`}
                    >
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Enviando..."}
                    </p>
                  </div>
                </div>
              </div>
              {isCurrentUser && (
                <div className="relative self-start flex-shrink-0">
                  {userPhotoURL ? (
                    <img
                      src={userPhotoURL}
                      alt={nickname}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-sky-800"
                    />
                  ) : (
                    <UserCircle
                      size={30}
                      className="text-gray-600 sm:w-8 sm:h-8 w-7 h-7"
                    />
                  )}
                  {onlineUsers[user.uid]?.online && (
                    <CircleDot
                      size={10}
                      className="absolute bottom-0 right-0 text-green-500 bg-[#101014] rounded-full"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {currentTypingUsers.length > 0 && (
        <div className="px-4 pb-1 text-xs text-sky-400 italic">
          {currentTypingUsers.join(", ")}{" "}
          {currentTypingUsers.length === 1
            ? "está digitando..."
            : "estão digitando..."}
        </div>
      )}

      <div
        className={`p-4 border-t border-gray-700/50 bg-[#101014] ${replyingToMessage || editingMessage ? "pb-2 pt-3" : ""}`}
      >
        {replyingToMessage && (
          <div className="mb-2 p-2 bg-[#2a2a2e] border border-gray-700 rounded-md text-xs text-gray-300 flex justify-between items-center">
            <div>
              Respondendo a{" "}
              <span className="font-semibold text-sky-400">
                {replyingToMessage.userName}
              </span>
              :
              <p className="text-gray-400 truncate italic">
                "{replyingToMessage.text.substring(0, 70)}
                {replyingToMessage.text.length > 70 ? "..." : ""}"
              </p>
            </div>
            <button
              onClick={cancelReply}
              className="p-1 text-gray-400 hover:text-red-400"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {editingMessage && (
          <div className="mb-2 p-2 bg-[#2a2a2e] border border-gray-700 rounded-md text-xs text-gray-300 flex justify-between items-center">
            <span>Editando sua mensagem...</span>
            <button
              onClick={cancelEdit}
              className="p-1 text-gray-400 hover:text-red-400"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="relative flex items-end">
          <div ref={emojiPickerRef} className="relative">
            <button
              title="Emojis"
              className="emoji-toggle-button p-3 mr-2 text-gray-400 hover:text-sky-400 focus:outline-none disabled:opacity-50"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              disabled={!user || !nickname || sending}
            >
              <SmilePlus size={20} />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 left-0 z-20">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  theme="dark"
                  emojiStyle="native"
                  searchDisabled
                  previewConfig={{ showPreview: false }}
                  height={350}
                  width={300}
                />
              </div>
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={editingMessage ? editingMessage.text : newMessage}
            onChange={handleTextareaInput}
            onFocus={() => updateTypingStatus(true)}
            onBlur={() => updateTypingStatus(false)}
            onKeyPress={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                (editingMessage
                  ? editingMessage.text.trim()
                  : newMessage.trim())
              ) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              user && nickname
                ? editingMessage
                  ? "Edite sua mensagem..."
                  : `Mensagem como ${nickname}...`
                : "Carregando seu perfil..."
            }
            className="flex-1 w-full p-3 pr-16 bg-[#2a2a2e] text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-500 resize-none custom-scrollbar-thin min-h-[48px] max-h-32 text-sm"
            rows="1"
            disabled={!user || !nickname || sending}
          />
          <div
            className={`absolute bottom-3 right-16 text-xs ${charsLeft < 0 ? "text-red-500 font-semibold" : charsLeft < 20 ? "text-yellow-400" : "text-gray-400"}`}
          >
            {editingMessage
              ? MAX_CHAT_CHARS - editingMessage.text.length
              : charsLeft}
          </div>
          <button
            onClick={handleSend}
            disabled={
              !(editingMessage
                ? editingMessage.text.trim()
                : newMessage.trim()) ||
              sending ||
              !user ||
              !nickname ||
              (editingMessage
                ? editingMessage.text.trim().length > MAX_CHAT_CHARS
                : newMessage.trim().length > MAX_CHAT_CHARS)
            }
            className="ml-2 p-3 bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center self-stretch"
            aria-label={editingMessage ? "Salvar edição" : "Enviar mensagem"}
          >
            {sending ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : editingMessage ? (
              <Check size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
      <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default ChatSession;
