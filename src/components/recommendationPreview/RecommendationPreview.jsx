import { useEffect, useState, useContext } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import Carousel from "../carousel/Carousel";
import {
  Film,
  PlayCircle,
  UserCircle,
  MessageSquareText,
  ExternalLink,
  CalendarDays,
  Zap,
  X,
} from "lucide-react";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import Loading from "../loading/Loading";

const getEmbedUrl = (url) => {
  if (!url) return "";
  try {
    if (
      url.includes("https://www.youtube.com/watch?v=VIDEO_ID") ||
      url.includes("youtu.be/")
    ) {
      let videoId;
      if (url.includes("youtu.be/")) {
        videoId = new URL(url).pathname.substring(1);
      } else {
        videoId = new URL(url).searchParams.get("v");
      }
      return `https://www.youtube.com/embed/VIDEO_ID{videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (url.includes("vimeo.com/")) {
      const videoId = new URL(url).pathname.substring(1);
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`;
    }
  } catch (error) {
    return url;
  }
  return url;
};

const RecommendationPreview = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const recommendationsRef = ref(db, "recommendations");

    const unsubscribe = onValue(recommendationsRef, (snapshot) => {
      setLoading(true);
      const data = snapshot.val();
      if (data) {
        const loadedRecommendations = Object.values(data).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setRecommendations(loadedRecommendations);
      } else {
        setRecommendations([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openModal = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecommendation(null);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  const recommendationItems = recommendations.map((rec) => (
    <div
      key={rec.id}
      className="w-72 sm:w-80 md:w-[330px] flex-shrink-0 p-3 group"
    >
      <div
        className="bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/80 
                     flex flex-col h-full overflow-hidden
                     transition-all duration-300 ease-out 
                     group-hover:shadow-xl group-hover:shadow-sky-500/25 
                     group-hover:border-sky-500/70 
                     group-hover:scale-[1.03] group-hover:-translate-y-1"
      >
        <div
          className="relative w-full aspect-[16/9] bg-slate-700 overflow-hidden cursor-pointer"
          onClick={() => openModal(rec)}
        >
          {rec.imageUrl ? (
            <img
              src={rec.imageUrl}
              alt={`Capa de ${rec.name}`}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-700">
              <Film size={48} className="text-slate-500" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
          {rec.videoUrl && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         p-3 rounded-full text-white 
                         bg-black/30 backdrop-blur-sm
                         transition-all duration-300 
                         opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
              aria-label={`Assistir trailer de ${rec.name}`}
            >
              <PlayCircle size={48} />
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-sky-300 mb-2 line-clamp-2 leading-tight group-hover:text-sky-200 transition-colors">
            {rec.name || "Título Indisponível"}
          </h3>

          <div className="flex items-center text-xs text-gray-400 mb-3 group-hover:text-gray-300 transition-colors">
            {rec.userPhotoURL ? (
              <img
                src={rec.userPhotoURL}
                alt={rec.userName}
                className="w-5 h-5 rounded-full mr-2 object-cover border border-slate-600"
              />
            ) : (
              <UserCircle size={18} className="mr-1.5 text-slate-500" />
            )}
            <span>
              Por:{" "}
              <strong className="font-semibold text-gray-200 group-hover:text-white">
                {rec.userName || "Usuário"}
              </strong>
            </span>
          </div>

          {rec.description && (
            <div className="flex items-start text-sm text-gray-300 mb-4 min-h-[50px]">
              <MessageSquareText
                size={20}
                className="mr-2.5 mt-0.5 text-sky-500/70 flex-shrink-0"
              />
              <p className="line-clamp-3 leading-relaxed text-gray-300/90 group-hover:text-gray-200 transition-colors">
                {rec.description}
              </p>
            </div>
          )}

          <div className="mt-auto pt-3 flex justify-between items-center border-t border-slate-700/50">
            <span className="text-xs text-gray-500 group-hover:text-gray-400 flex items-center transition-colors">
              <CalendarDays size={14} className="mr-1.5" />
              {rec.createdAt
                ? new Date(rec.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Data Indisponível"}
            </span>
            <button
              onClick={() => openModal(rec)}
              className="text-xs font-medium text-sky-400 hover:text-sky-300 hover:underline flex items-center transition-colors"
            >
              Detalhes <PlayCircle size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  ));

  if (loading) {
    return (
      <div className="flex-grow md:ml-20 p-4 text-center text-gray-400 pt-20 md:pt-12 min-h-[40vh] flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex-grow md:ml-20 py-10 md:py-16 bg-gradient-to-b from-black via-slate-900 to-black text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {recommendations.length > 0 ? (
          <>
            <div className="mb-8 md:mb-12 text-center md:text-left relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white inline-block tracking-tight">
                Recomendações{" "}
                <span className="text-sky-400">da Comunidade</span>
              </h2>
              <div className="mt-1 h-1 w-20 md:w-28 bg-sky-500 rounded-full mx-auto md:mx-0"></div>
              <p className="text-gray-400 mt-4 text-base sm:text-lg max-w-2xl mx-auto md:mx-0">
                Conteúdos incríveis sugeridos por outros cinéfilos e seriadores.
                Em breve no nosso catálogo!
              </p>
            </div>
            <Carousel items={recommendationItems} />
          </>
        ) : (
          <div className="text-center py-20 min-h-[50vh] flex flex-col justify-center items-center bg-slate-900/30 rounded-xl shadow-inner">
            <Zap
              size={72}
              className="mx-auto text-sky-600/60 mb-8 opacity-70"
            />
            <p className="text-gray-300 text-2xl font-semibold mb-3">
              Ainda sem Recomendações por Aqui...
            </p>
            <p className="text-gray-400 text-lg mb-6">
              O universo cinematográfico aguarda suas sugestões!
            </p>
            <a
              href="/recommendations"
              className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg shadow-md 
                          hover:bg-sky-400 transition-all duration-200 transform hover:scale-105
                          text-base flex items-center"
            >
              Sugerir Conteúdo Agora <ExternalLink size={18} className="ml-2" />
            </a>
          </div>
        )}
      </div>

      {isModalOpen && selectedRecommendation && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4 sm:p-6"
          onClick={closeModal}
        >
          <div
            className="bg-slate-800 w-full max-w-3xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-slate-700">
              <h3 className="text-lg sm:text-xl font-semibold text-sky-300 truncate">
                {selectedRecommendation.name || "Detalhes da Recomendação"}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-sky-400 transition-colors p-1 rounded-full hover:bg-slate-700"
                aria-label="Fechar modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto">
              {selectedRecommendation.videoUrl && (
                <div className="aspect-video bg-black">
                  <iframe
                    className="w-full h-full"
                    src={getEmbedUrl(selectedRecommendation.videoUrl)}
                    title={`Trailer de ${selectedRecommendation.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <div className="p-4 sm:p-6 space-y-4">
                {!selectedRecommendation.videoUrl && (
                  <p className="text-center text-slate-400 py-4">
                    Trailer não disponível para esta recomendação.
                  </p>
                )}

                <div className="flex items-center text-sm text-gray-400">
                  {selectedRecommendation.userPhotoURL ? (
                    <img
                      src={selectedRecommendation.userPhotoURL}
                      alt={selectedRecommendation.userName}
                      className="w-6 h-6 rounded-full mr-2.5 object-cover border-2 border-slate-600"
                    />
                  ) : (
                    <UserCircle size={20} className="mr-2 text-slate-500" />
                  )}
                  <span>
                    Sugerido por:{" "}
                    <strong className="font-medium text-gray-200">
                      {selectedRecommendation.userName || "Usuário Anônimo"}
                    </strong>
                  </span>
                  <span className="mx-2 text-slate-600">•</span>
                  <CalendarDays size={15} className="mr-1.5 text-slate-500" />
                  <span className="text-slate-500">
                    {selectedRecommendation.createdAt
                      ? new Date(
                          selectedRecommendation.createdAt,
                        ).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Data Indisponível"}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-sky-400 mb-1.5">
                    Descrição:
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedRecommendation.description ||
                      "Nenhuma descrição fornecida."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationPreview;
