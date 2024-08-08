import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const RecommendationPreview = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const recommendationsRef = ref(db, 'recommendations/');

    const unsubscribe = onValue(recommendationsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedRecommendations = data ? Object.values(data) : [];
      setRecommendations(loadedRecommendations);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="ml-16 lg:ml-20 p-4">
      <h1 className="text-2xl font-bold mb-4">Em Breve</h1>
      <div className="flex flex-wrap">
        {recommendations.map((rec, index) => (
          <div key={index} className="">
            <div className="w-full">
              <img
                src={rec.imageUrl}
                alt={rec.name}
                className="w-48 h-72 object-cover rounded-lg m-5"
              />
              <h3 className="text-lg font-semibold text-gray-800 mt-2 text-center">{rec.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationPreview;
