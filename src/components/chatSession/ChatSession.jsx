import React, { useState, useEffect, useContext } from "react";
import { ref, onValue, push, get } from "firebase/database";
import { database } from "../../services/firebaseConfig/FirebaseConfig";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const ChatSession = ({ sessionCode }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      toast.error("Você precisa estar logado para acessar o chat.");
      navigate('/login');
      return;
    }

    const fetchNickname = async () => {
      try {
        const nicknameRef = ref(database, `users/${user.uid}/updateNick/${user.uid}`);
        const snapshot = await get(nicknameRef);
        if (snapshot.exists()) {
          setNickname(snapshot.val());
        } else {
          toast.info("Você precisa definir um nickname.");
          navigate('/profile', { state: { from: location.pathname } });
        }
      } catch (error) {
        toast.error("Erro ao buscar nickname.");
      }
    };

    fetchNickname();
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    if (!nickname) return;

    const messagesRef = ref(database, `sessions/${sessionCode}/messages`);

    const handleValueChange = (snapshot) => {
      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        const messagesArray = Object.keys(messagesData).map(key => ({
          id: key,
          ...messagesData[key]
        }));
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    };

    const unsubscribe = onValue(messagesRef, handleValueChange);

    return () => {
      unsubscribe();
    };
  }, [sessionCode, nickname]);

  const handleSend = async () => {
    if (!nickname) {
      toast.info("Você precisa definir um nickname antes de enviar mensagens.");
      navigate('/profile', { state: { from: location.pathname } });
      return;
    }

    if (message.trim() === "") return;

    const newMessage = {
      user: nickname,
      message,
      timestamp: new Date().toISOString(),
    };

    try {
      const messagesRef = ref(database, `sessions/${sessionCode}/messages`);
      await push(messagesRef, newMessage);
      setMessage("");
    } catch (error) {
      toast.error("Erro ao enviar mensagem.");
    }
  };

  return (
    <div className="flex flex-col h-full p-2 md:p-4">
      <div className="overflow-y-auto h-80 border p-2 bg-gray-50 rounded-lg shadow-md max-h-[calc(100vh-150px)]">
        {messages.length > 0 ? (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-2 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col">
                  <strong className="font-semibold text-sm md:text-base">
                    {typeof msg.user === 'object' ? msg.user.nickname : msg.user}:
                  </strong>
                  <p className="text-gray-800 break-words text-sm md:text-base mt-1 ml-1">
                    {msg.message}
                  </p>
                  <div className="text-xs text-gray-500 mt-1 md:text-sm ml-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm md:text-base">Nenhuma mensagem.</p>
        )}
      </div>
      <div className="mt-5 flex flex-col sm:flex-row items-center lg:gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite uma mensagem..."
          className="flex-1 px-2 py-3 border border-gray-300 rounded-lg text-sm md:text-base w-full"
        />
        <button
          onClick={handleSend}
          className="mt-2 w-full p-3 sm:mt-0 lg:w-20 lg:px-3 lg:py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 text-sm md:text-base"
        >
          Enviar
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChatSession;
