import { useEffect, useState, useContext } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import Carousel from "../carousel/Carousel";
import { Film, PlayCircle, UserCircle, MessageSquareText, ExternalLink, CalendarDays } from "lucide-react";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import Loading from "../loading/Loading";

const RecommendationPreview = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const db = getDatabase();
    const recommendationsRef = ref(db, 'recommendations');

    const unsubscribe = onValue(recommendationsRef, (snapshot) => {
      setLoading(true);
      const data = snapshot.val();
      if (data) {
        const loadedRecommendations = Object.values(data)
          // Em um cenário real, você filtraria por status: 'approved'
          // .filter(rec => rec.status === 'approved') 
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Mais recentes primeiro
        setRecommendations(loadedRecommendations);
      } else {
        setRecommendations([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const recommendationItems = recommendations.map((rec) => (
    <div 
      key={rec.id} 
      className="w-72 sm:w-[300px] md:w-[320px] flex-shrink-0 p-2.5 group"
    >
      <div className="bg-[#1e1e1e] rounded-lg shadow-xl overflow-hidden flex flex-col h-full border border-gray-800/70 transition-all duration-300 ease-in-out group-hover:shadow-sky-500/20 group-hover:border-sky-700/50 transform group-hover:scale-[1.02]">
        <div className="relative w-full aspect-[16/9] bg-gray-800 overflow-hidden">
          {rec.imageUrl ? (
            <img
              src={rec.imageUrl}
              alt={`Capa de ${rec.name}`}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film size={48} className="text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          {rec.videoUrl && (
            <a
              href={rec.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white hover:bg-sky-500/80 transition-all duration-200 opacity-80 group-hover:opacity-100"
              aria-label={`Assistir trailer de ${rec.name}`}
            >
              <PlayCircle size={24} />
            </a>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-base font-bold text-sky-400 mb-1.5 line-clamp-2 leading-tight group-hover:text-sky-300 transition-colors">
            {rec.name || "Título não disponível"}
          </h3>
          
          <div className="flex items-center text-xs text-gray-400 mb-3">
            {rec.userPhotoURL ? (
              <img src={rec.userPhotoURL} alt={rec.userName} className="w-5 h-5 rounded-full mr-2 object-cover border border-gray-600"/>
            ) : (
              <UserCircle size={16} className="mr-1.5 text-gray-500" />
            )}
            <span>Por: <strong className="text-gray-300 font-medium">{rec.userName || "Usuário"}</strong></span>
          </div>

          {rec.description && (
            <div className="flex items-start text-xs text-gray-400 mb-3 bg-gray-800/40 p-2.5 rounded-md border border-gray-700/60 min-h-[60px]">
              <MessageSquareText size={18} className="mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
              <p className="line-clamp-3 leading-relaxed text-gray-300">
                {rec.description}
              </p>
            </div>
          )}
          
          <div className="mt-auto pt-2 flex justify-between items-center">
            <span className="text-xs text-gray-500 flex items-center">
              <CalendarDays size={14} className="mr-1.5" />
              {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : ''}
            </span>
            {rec.videoUrl && (
                 <a
                  href={rec.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sky-500 hover:text-sky-400 hover:underline flex items-center"
                >
                  Ver Vídeo <ExternalLink size={14} className="ml-1" />
                </a>
            )}
          </div>
        </div>
      </div>
    </div>
  ));

  if (loading) {
    return (
        <div className="flex-grow md:ml-20 p-4 text-center text-gray-400 pt-20 md:pt-12">
            <Loading />
        </div>
    );
  }

  return (
    <div className="flex-grow md:ml-20 py-8 md:py-12 bg-black text-gray-300 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {recommendations.length > 0 ? (
          <>
            <div className="mb-6 md:mb-10 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white inline-block">
                Recomendações da Comunidade
              </h2>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                Conteúdos incríveis sugeridos por outros cinéfilos e seriadores. Em breve no nosso catálogo!
              </p>
            </div>
            <Carousel items={recommendationItems} />
          </>
        ) : (
          <div className="text-center py-16 min-h-[40vh] flex flex-col justify-center items-center">
            <Film size={64} className="mx-auto text-gray-700 mb-6" />
            <p className="text-gray-500 text-xl mb-2">Nenhuma recomendação por aqui ainda...</p>
            <p className="text-gray-600 text-base">
              Que tal ser o primeiro a <a href="/recommendations" className="text-sky-500 hover:text-sky-400 font-semibold hover:underline">sugerir um conteúdo</a>?
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationPreview;
