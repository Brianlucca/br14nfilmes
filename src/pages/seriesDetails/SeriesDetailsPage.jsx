import { Calendar, Clapperboard, Star, Heart, HeartOff, Popcorn, Share } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useSeriesDetails from "../../hooks/useSerieDetails/useSerieDetails";
import Comments from "../../components/comments/Comments";
import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";
import Sidebar from "../../components/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";

const SeriesDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const {
    series,
    comments,
    isFavorite,
    handleCommentSubmit,
    handleDeleteComment,
    toggleFavorite,
  } = useSeriesDetails(id);

  if (!series) {
    return <Loading />;
  }

  const handleCreateSession = () => {
    navigate(`/create-session/${id}`);
  };

  const handleShare = async () => {
    const message = `Confira ${series.name} em AinzOoal Films! Avaliação da Série: ${series.rating}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Faça o seu login e avalie!`,
          text: message,
          url: window.location.href,
        })
      } catch (error) {
        toast.error('Erro ao compartilhar o código da sessão.')
      }
    } else {
      toast.warn(
        'A funcionalidade de compartilhamento não está disponível neste navegador.',
      )
    }
  }


  return (
    <div>
      <Sidebar />
      <div className="bg-black min-h-screen">
        <div className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${series.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#1a1a1a]/70 to-black"></div>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8 text-white">
            <div className="flex flex-col items-center text-center space-y-6">
              <h1 className="text-4xl font-bold">{series.name}</h1>
              <p className="text-lg">{series.description}</p>
              <p className="text-lg font-semibold flex items-center space-x-2">
                <Star className="hover:text-yellow-300" />
                <span>{series.rating}</span>
              </p>
              <p className="text-lg font-semibold flex items-center space-x-2">
                <Clapperboard className="hover:text-red-300" />
                <span>{series.category}</span>
              </p>
              <p className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="hover:text-blue-300" />
                <span>{series.year}</span>
              </p>
              <div className="flex flex-col sm:flex-row sm:space-x-4 mt-6">
                <button
                  onClick={toggleFavorite}
                  className={`px-4 py-2 font-semibold rounded-md shadow-md flex items-center justify-center ${
                    isFavorite
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-[#605f5f] hover:bg-red-600"
                  } text-white mb-2 sm:mb-0 flex items-center space-x-2`}
                >
                  {isFavorite ? (
                    <>
                      <HeartOff className="text-white mr-2" />
                      <span>Remover Favorito</span>
                    </>
                  ) : (
                    <>
                      <Heart className="text-white mr-2" />
                      <span>Adicionar aos Favoritos</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCreateSession}
                  className="px-4 py-2 bg-[#605f5f] text-white font-semibold rounded-md shadow-md hover:bg-blue-600 flex items-center justify-center"
                >
                  <Popcorn className="text-white mr-2" />
                  <span>Criar Sessão</span>
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2 mt-2 sm:mt-0 bg-[#605f5f] text-white font-semibold rounded-md shadow-md hover:bg-blue-600 flex items-center justify-center"
                >
                  <Share className="text-white mr-2" />
                  <span>Compartilhar</span>
                </button>
              </div>
              {series.youtubeLink && (
                <div className="w-full md:w-3/4 lg:w-2/3 mt-8">
                  <iframe
                    src={series.youtubeLink}
                    title={`Trailer de ${series.name}`}
                    width="100%"
                    height="415"
                    className="rounded-lg shadow-md lg:mt-5"
                    allow="fullscreen"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <Comments
          comments={comments}
          onCommentSubmit={handleCommentSubmit}
          onDeleteComment={handleDeleteComment}
        />
        <Footer />
        <ToastContainer />
      </div>
    </div>
  );
};

export default SeriesDetailsPage;
