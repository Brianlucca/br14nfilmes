import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../../../services/firebaseConfig/FirebaseConfig";
import Loading from "../../loading/Loading";

const AdminFaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const usersRef = ref(database, "users");
        const snapshot = await get(usersRef);
        const usersData = snapshot.val();

        const faqsList = [];

        for (const uid in usersData) {
          const faqData = usersData[uid]?.faq;
          const nicknameData = usersData[uid]?.updateNick?.[uid]?.nickname;

          if (faqData && nicknameData) {
            faqsList.push({
              nickname: nicknameData,
              message: faqData.message,
              timestamp: faqData.timestamp,
            });
          }
        }

        setFaqs(faqsList);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (faqs.length === 0) {
    return <p className="text-white">Nenhuma dúvida foi enviada ainda.</p>;
  }

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        Relatos de Usuários
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#2d2d2d] p-4 rounded-lg shadow-md space-y-2"
          >
            <p className="text-lg text-white font-semibold">
              {faq.nickname} perguntou:
            </p>
            <p className="text-white">{faq.message}</p>
            <p className="text-sm text-gray-400">
              Enviado em: {new Date(faq.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFaqList;
