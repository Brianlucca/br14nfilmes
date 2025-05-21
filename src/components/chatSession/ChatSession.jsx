import React, { useState, useEffect, useContext, useRef } from "react";
import { ref, onValue, push, serverTimestamp, get } from "firebase/database";
import { database } from "../../services/firebaseConfig/FirebaseConfig";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, UserCircle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const MESSAGE_LIMIT = 10; 
const TIME_WINDOW_MS = 60000; 
const MAX_CHAT_CHARS = 280;

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
        console.error("Erro ao buscar dados do usuário:", error);
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
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
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
    if (!newMessage.trim() || newMessage.length > MAX_CHAT_CHARS) {
        if (newMessage.length > MAX_CHAT_CHARS) {
            toast.error(`A mensagem excede o limite de ${MAX_CHAT_CHARS} caracteres.`);
        }
        return;
    }

    const currentTime = Date.now();
    const userMessagesInWindow = messages.filter(
      (msg) =>
        msg.userId === user.uid &&
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
      text: newMessage.trim(),
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
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  };

  const handleTextareaInput = (e) => {
    const currentMessage = e.target.value;
    if (currentMessage.length <= MAX_CHAT_CHARS) {
      setNewMessage(currentMessage);
    } else {
      setNewMessage(currentMessage.substring(0, MAX_CHAT_CHARS));
    }
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col h-full bg-[#16161a] p-4 sm:p-6 rounded-xl shadow-lg border border-gray-800/50">
      <style jsx global>{`
        .chat-messages-scrollbar::-webkit-scrollbar { width: 6px; }
        .chat-messages-scrollbar::-webkit-scrollbar-track { background: #1e1e1e; border-radius: 10px; }
        .chat-messages-scrollbar::-webkit-scrollbar-thumb { background: #4a4a4a; border-radius: 10px; }
        .chat-messages-scrollbar::-webkit-scrollbar-thumb:hover { background: #6a6a6a; }
        .custom-scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thin::-webkit-scrollbar-track { background: #2d2d2d; border-radius: 10px; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb { background: #555; border-radius: 10px; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #777; }
      `}</style>
      
      <p className="text-xs text-sky-400/80 text-center mb-3 px-2 py-1.5 bg-sky-900/30 rounded-md border border-sky-700/40">
        Lembre-se: não compartilhe informações pessoais ou sensíveis neste chat. Mantenha a conversa respeitosa.
      </p>

      <div className="flex-grow overflow-y-auto h-72 sm:h-80 md:h-96 mb-4 p-1 chat-messages-scrollbar space-y-4">
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
                    <img src={msg.userPhotoURL} alt={msg.userName} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover self-start flex-shrink-0"/>
                    : <UserCircle size={30} className="text-gray-500 self-start flex-shrink-0 sm:w-8 sm:h-8 w-7 h-7" />
                )}
                <div
                  className={`p-3 rounded-xl max-w-[70%] sm:max-w-[65%] md:max-w-[60%] shadow ${
                    isCurrentUser
                      ? "bg-sky-600 text-white rounded-br-none"
                      : "bg-[#2d2d2d] text-gray-200 rounded-bl-none border border-gray-700/70"
                  }`}
                >
                  {!isCurrentUser && (
                    <p className={`text-xs font-semibold mb-0.5 ${isCurrentUser ? "text-sky-100" : "text-sky-400"}`}>
                      {msg.userName || "Usuário"}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {msg.text}
                  </p>
                  <p className={`text-[10px] mt-1.5 ${isCurrentUser ? "text-sky-200/80 text-right" : "text-gray-500 text-left"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {isCurrentUser && (
                  userPhotoURL ? 
                    <img src={userPhotoURL} alt={nickname} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover self-start flex-shrink-0"/>
                    : <UserCircle size={30} className="text-gray-500 self-start flex-shrink-0 sm:w-8 sm:h-8 w-7 h-7" />
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

      <div className="mt-auto pt-4 border-t border-gray-700/50">
        <div className="relative">
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
                className="flex-1 w-full p-3 pr-12 bg-[#2d2d2d] text-gray-200 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-500 resize-none custom-scrollbar-thin min-h-[44px] max-h-28"
                rows="1"
                disabled={!user || !nickname || sending}
                maxLength={MAX_CHAT_CHARS}
            />
            <div className={`absolute bottom-2 right-3 text-xs ${charsLeft < 20 ? (charsLeft < 0 ? 'text-red-500' : 'text-yellow-400') : 'text-gray-400'}`}>
                {charsLeft}
            </div>
        </div>
        <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending || !user || !nickname || newMessage.length > MAX_CHAT_CHARS}
            className="w-full mt-2 p-3 bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
      <ToastContainer />
    </div>
  );
};

export default ChatSession;
