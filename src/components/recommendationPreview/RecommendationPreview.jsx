import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import Carousel from "../carousel/Carousel"; 

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

  const recommendationItems = recommendations.map((rec, index) => (
    <div key={index} className="w-40 sm:w-60 flex-shrink-0 p-2">
      <div className="flex justify-center">
        <div className="w-full">
          <img
            src={rec.imageUrl}
            alt={rec.name}
            className="w-36 h-56 sm:w-48 sm:h-72 object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  ));

  return (
    <div className="sm:ml-16 lg:ml-20 p-2 sm:p-4">
      {recommendations.length > 0 && (
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:text-left text-gray-700">Em Breve</h1>
      )}
      <Carousel items={recommendationItems} />
    </div>
  );
};

export default RecommendationPreview;
