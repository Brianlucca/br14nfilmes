import { useContext, useState } from "react";
import { MessageCircle, XCircle } from "lucide-react";
import { ref, update } from "firebase/database";
import { database } from "../../services/firebaseConfig/FirebaseConfig";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { toast, ToastContainer } from "react-toastify";

const Faq = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isInputVisible, setInputVisible] = useState(false);

  const handleSendFaq = async () => {
    if (!message.trim()) {
      toast.error("Por favor, escreva sua dúvida ou problema.");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado para enviar uma dúvida.");
      return;
    }

    setSending(true);
    const faqRef = ref(database, `users/${user.uid}/faq`);

    try {
      await update(faqRef, {
        message,
        timestamp: new Date().toISOString(),
      });
      toast.success("Sua dúvida foi enviada com sucesso!");
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
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isInputVisible && (
        <button
          onClick={handleToggleInput}
          className="flex items-center bg-[#605f5f] text-white px-3 py-3 rounded-full shadow-lg hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
        >
          <MessageCircle />
        </button>
      )}

      {isInputVisible && (
        <div className="relative bg-[#1a1a1a] p-6 rounded-lg shadow-lg w-[90vw] max-w-3xl">
          <div className="absolute top-2 right-2">
            <p
              onClick={handleToggleInput}
              className="text-white hover:text-gray-400"
            >
              <XCircle size={24} />
            </p>
          </div>
          <h3 className="text-lg text-white mb-4">Descreva seu problema ou dúvida</h3>
          <textarea
            className="w-full h-32 p-3 rounded-lg bg-[#2d2d2d] text-white focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
            placeholder="Descreva seu problema ou dúvida..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSendFaq}
              disabled={sending}
              className="px-3 py-3 rounded-lg bg-[#605f5f] text-white font-semibold hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
            >
              {sending ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Faq;
