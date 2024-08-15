import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";

const RecommendationList = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const db = getDatabase();
    const recommendationsRef = ref(db, 'recommendations/');

    const unsubscribe = onValue(recommendationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedRecommendations = Object.entries(data).map(([id, rec]) => ({
          id, ...rec
        }));
        setRecommendations(loadedRecommendations);
      } else {
        setRecommendations([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (id) => {
    const db = getDatabase();
    const recommendationRef = ref(db, `recommendations/${id}`);
    remove(recommendationRef)
      .then(() => {
        setMessage("Recomendação Removida");
        setTimeout(() => setMessage(""), 3000); 
      })
      .catch((error) => {
        setMessage("Error removing recommendation: " + error.message);
        setTimeout(() => setMessage(""), 3000);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">Recomendações</h2>
      {message && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
          {message}
        </div>
      )}
      {recommendations.length === 0 ? (
        <p>Nenhuma Recomendação no momento</p>
      ) : (
        <div className="space-y-4 ">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 bg-[#1a1a1a] shadow-md rounded-lg">
              <img src={rec.imageUrl} alt={rec.name} className="w-full h-40 object-cover rounded-md mb-4" />
              <strong className="text-2xl font-bold mb-2 text-white">{rec.name}</strong>
              <p className="text-white mt-2">{rec.description}</p>
              <a
                href={rec.videoUrl}
                className="text-blue-600 hover:underline mb-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Veja o video
              </a>
              <p className="text-gray-400">Link da Imagem: {rec.imageUrl}</p>
              <p className="text-white">Recomendado por {rec.userName}</p>
              <button
                onClick={() => handleDelete(rec.id)}
                className="mt-5 w-full p-1 bg-[#605f5f] text-white font-semibold rounded-lg hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
              >
                Deletar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationList;
