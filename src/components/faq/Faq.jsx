import { ref, serverTimestamp, update } from "firebase/database";
import { MessageSquarePlus, Send, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { database } from "../../services/firebaseConfig/FirebaseConfig";

const Faq = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isInputVisible, setInputVisible] = useState(false);
  const MAX_CHARS = 500; // Define o limite máximo de caracteres
  const [charsLeft, setCharsLeft] = useState(MAX_CHARS);

  useEffect(() => {
    setCharsLeft(MAX_CHARS - message.length);
  }, [message]);

  const handleSendFaq = async () => {
    if (!message.trim()) {
      toast.error("Por favor, escreva sua dúvida ou problema.");
      return;
    }
    if (message.length > MAX_CHARS) {
      toast.error(`Sua mensagem excedeu o limite de ${MAX_CHARS} caracteres.`);
      return;
    }

    if (!user) {
      toast.warn("Você precisa estar logado para enviar uma dúvida.");
      return;
    }

    setSending(true);
    const faqRef = ref(database, `users/${user.uid}/faq/${Date.now()}`);

    try {
      await update(faqRef, {
        message: message.trim(),
        timestamp: serverTimestamp(),
        email: user.email,
        userId: user.uid,
        status: "pending",
      });
      toast.success(
        "Sua dúvida foi enviada com sucesso! Responderemos em breve.",
      );
      setMessage("");
      setInputVisible(false);
    } catch (error) {
      toast.error("Erro ao enviar a dúvida. Tente novamente mais tarde.");
    } finally {
      setSending(false);
    }
  };

  const handleToggleInput = () => {
    setInputVisible(!isInputVisible);
    if (isInputVisible) {
      setMessage("");
    }
  };

  const handleMessageChange = (e) => {
    const currentMessage = e.target.value;
    if (currentMessage.length <= MAX_CHARS) {
      setMessage(currentMessage);
    } else {
      setMessage(currentMessage.substring(0, MAX_CHARS));
      toast.warn(`Limite de ${MAX_CHARS} caracteres atingido.`);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[999]">
        {!isInputVisible && (
          <button
            onClick={handleToggleInput}
            className="p-3 md:p-4 bg-sky-600 text-white rounded-full shadow-2xl hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-500/50 transform transition-all duration-200 ease-in-out hover:scale-110 active:scale-95"
            aria-label="Abrir chat de ajuda"
          >
            <MessageSquarePlus size={28} />
          </button>
        )}

        {isInputVisible && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fadeIn">
            <div className="bg-[#1e1e1e] p-6 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700/70 transform transition-all duration-300 ease-out animate-scaleUp">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-sky-400 flex items-center">
                  <MessageSquarePlus size={24} className="mr-2.5" />
                  Problemas?
                </h3>
                <button
                  onClick={handleToggleInput}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
                  aria-label="Fechar chat de ajuda"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Descreva sua questão abaixo e farei o possivel para resolver.
              </p>
              <div className="relative">
                <textarea
                  className="w-full h-36 p-3.5 rounded-lg bg-[#2d2d2d] text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-500 resize-none custom-scrollbar-thin"
                  placeholder="Digite sua mensagem aqui..."
                  value={message}
                  onChange={handleMessageChange}
                  disabled={sending}
                  maxLength={MAX_CHARS}
                />
                <div
                  className={`absolute bottom-2 right-3 text-xs ${charsLeft < 0 ? "text-red-500" : "text-gray-400"}`}
                >
                  {charsLeft} restantes
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={handleSendFaq}
                  disabled={
                    sending || !message.trim() || message.length > MAX_CHARS
                  }
                  className="px-6 py-2.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
                >
                  {sending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2.5 h-5 w-5 text-white"
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
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Enviar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleUp {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s ease-out forwards;
        }

        .custom-scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-track {
          background: #2d2d2d;
          border-radius: 10px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 10px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `}</style>
    </>
  );
};

export default Faq;
