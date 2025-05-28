import React, { useState, useEffect, useContext, useRef } from "react";
import { ref, onValue, push, serverTimestamp, get } from "firebase/database";
import { database } from "../../services/firebaseConfig/FirebaseConfig";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, UserCircle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const MESSAGE_LIMIT = 10; 
const TIME_WINDOW_MS = 60000; 
const MAX_CHAT_CHARS = 280;

const getYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }
  let videoId = null;

  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/
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
      if (parsedUrl.hostname.includes('youtube.com') && parsedUrl.searchParams.has('v')) {
        const vParam = parsedUrl.searchParams.get('v');
        if (vParam && vParam.length === 11) {
          videoId = vParam;
        }
      }
    } catch (e) {
    }
  }

  return videoId;
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

  useEffect(() => {
    setCharsLeft(MAX_CHAT_CHARS - newMessage.length);
  }, [newMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
          const userNickname = userData.updateNick?.[user.uid]?.nickname || userData.nickname || `Usuário-${user.uid.substring(0, 5)}`;
          setNickname(userNickname);
          setUserPhotoURL(userData.photoURL || user.photoURL || null); 
        } else {
          toast.info("Você precisa definir um nickname no seu perfil para usar o chat.");
          navigate("/profile", { state: { from: location.pathname, needsNickname: true } });
        }
      } catch (error) {
        toast.error("Erro ao buscar dados do seu perfil.");
      }
    };

    fetchUserData();
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    if (!sessionCode || !nickname) return;

    const messagesRef = ref(database, `sessions/${sessionCode}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        const messagesArray = Object.keys(messagesData)
          .map((key) => ({
            id: key,
            ...messagesData[key],
          }))
          .sort((a, b) => (a.timestamp && b.timestamp ? new Date(a.timestamp) - new Date(b.timestamp) : 0));
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [sessionCode, nickname]);

  const handleSend = async () => {
    if (!user) {
      toast.warn("Você precisa estar logado para enviar mensagens.");
      return;
    }
    if (!nickname) {
      toast.info("Defina um nickname no seu perfil para enviar mensagens.");
      navigate("/profile", { state: { from: location.pathname, needsNickname: true } });
      return;
    }
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || trimmedMessage.length > MAX_CHAT_CHARS) {
        if (trimmedMessage.length > MAX_CHAT_CHARS) {
            toast.error(`A mensagem excede o limite de ${MAX_CHAT_CHARS} caracteres.`);
        }
        return;
    }

    const currentTime = Date.now();
    const userMessagesInWindow = messages.filter(
      (msg) =>
        msg.userId === user.uid &&
        msg.timestamp && 
        currentTime - new Date(msg.timestamp).getTime() < TIME_WINDOW_MS
    );

    if (userMessagesInWindow.length >= MESSAGE_LIMIT) {
      const lastUserMessageTime = new Date(userMessagesInWindow[userMessagesInWindow.length -1].timestamp).getTime();
      const timeLeft = Math.round((TIME_WINDOW_MS - (currentTime - lastUserMessageTime))/1000);
      toast.warn(`Você enviou muitas mensagens! Tente novamente em ${timeLeft > 0 ? timeLeft : 1} segundos.`);
      return;
    }

    setSending(true);
    const messageData = {
      userId: user.uid,
      userName: nickname,
      userPhotoURL: userPhotoURL,
      text: trimmedMessage,
      timestamp: serverTimestamp(),
    };

    try {
      const sessionMessagesRef = ref(database, `sessions/${sessionCode}/messages`);
      await push(sessionMessagesRef, messageData);
      setNewMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; 
      }
    } catch (error) {
      toast.error("Erro ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  };

  const handleTextareaInput = (e) => {
    const currentMessage = e.target.value;
    if (currentMessage.length <= MAX_CHAT_CHARS + 20) { 
        setNewMessage(currentMessage);
    }
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const renderMessageContent = (text) => {
    const videoId = getYouTubeVideoId(text);
    const textElement = <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{text}</p>;
  
    if (videoId) {
      return (
        <>
          <div className="my-2">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-600 bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          {textElement}
        </>
      );
    }
    
    return textElement; 
  };


  return (
    <div className="flex flex-col h-full bg-[#101014] text-gray-200">
      <style jsx global>{`
        .chat-messages-scrollbar::-webkit-scrollbar { width: 6px; }
        .chat-messages-scrollbar::-webkit-scrollbar-track { background: #18181b; border-radius: 10px; }
        .chat-messages-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
        .chat-messages-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }
        .custom-scrollbar-thin::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar-thin::-webkit-scrollbar-track { background: #27272a; border-radius: 10px; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb { background: #52525b; border-radius: 10px; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #71717a; }
      `}</style>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4 chat-messages-scrollbar">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isCurrentUser = msg.userId === user?.uid;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                {!isCurrentUser && (
                  msg.userPhotoURL ? 
                    <img src={msg.userPhotoURL} alt={msg.userName} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover self-start flex-shrink-0 border-2 border-gray-700"/>
                    : <UserCircle size={30} className="text-gray-600 self-start flex-shrink-0 sm:w-8 sm:h-8 w-7 h-7" />
                )}
                <div
                  className={`p-3 rounded-xl max-w-[75%] sm:max-w-[70%] md:max-w-[65%] shadow-md ${
                    isCurrentUser
                      ? "bg-sky-600 text-white rounded-br-none"
                      : "bg-[#2a2a2e] text-gray-100 rounded-bl-none border border-gray-700"
                  }`}
                >
                  {!isCurrentUser && (
                    <p className={`text-xs font-semibold mb-1 ${isCurrentUser ? "text-sky-100" : "text-sky-400"}`}>
                      {msg.userName || "Usuário"}
                    </p>
                  )}
                  {renderMessageContent(msg.text)}
                  <p className={`text-[10px] mt-1.5 ${isCurrentUser ? "text-sky-200/80 text-right" : "text-gray-500 text-left"}`}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Enviando..."}
                  </p>
                </div>
                {isCurrentUser && (
                  userPhotoURL ? 
                    <img src={userPhotoURL} alt={nickname} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover self-start flex-shrink-0 border-2 border-sky-800"/>
                    : <UserCircle size={30} className="text-gray-600 self-start flex-shrink-0 sm:w-8 sm:h-8 w-7 h-7" />
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 text-sm py-10">
            Nenhuma mensagem ainda. Seja o primeiro a iniciar a conversa!
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700/50 bg-[#101014]">
        <div className="relative flex items-center">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleTextareaInput}
              onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey && newMessage.trim()) {
                  e.preventDefault();
                  handleSend();
              }
              }}
              placeholder={user && nickname ? `Mensagem como ${nickname}...` : "Carregando seu perfil..."}
              className="flex-1 w-full p-3 pr-16 bg-[#2a2a2e] text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-500 resize-none custom-scrollbar-thin min-h-[48px] max-h-32 text-sm"
              rows="1"
              disabled={!user || !nickname || sending}
            />
            <div className={`absolute bottom-3 right-14 text-xs ${charsLeft < 0 ? 'text-red-500 font-semibold' : (charsLeft < 20 ? 'text-yellow-400' : 'text-gray-400')}`}>
                {charsLeft < 0 ? `-${Math.abs(charsLeft)}` : charsLeft}
            </div>
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || sending || !user || !nickname || newMessage.trim().length > MAX_CHAT_CHARS}
              className="ml-2 p-3 bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Enviar mensagem"
            >
              {sending ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ) : (
              <Send size={20} />
              )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSession;