import {
  Calendar,
  Clapperboard,
  Heart,
  HeartOff,
  MessageSquare,
  PlayCircle,
  Popcorn,
  Share,
  Star,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Comments from "../../components/comments/Comments";
import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";
import Sidebar from "../../components/sidebar/Sidebar";
import useMovieDetails from "../../hooks/useMovieDetails/useMovieDetails";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    movie,
    comments,
    isFavorite,
    handleCommentSubmit,
    handleDeleteComment,
    toggleFavorite,
  } = useMovieDetails(id);

  const handleCreateSession = () => {
    navigate(`/create-session/${id}`);
  };

  const handleShare = async () => {
    const message = `Confira ${movie.name} em Br14nfilmes! Avaliação: ${movie.rating}\n\n`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.name,
          text: message,
          url: shareUrl,
        });
      } catch (error) {
        toast.error("Erro ao compartilhar. Tente novamente.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${message} ${shareUrl}`);
        toast.success("Link copiado para a área de transferência!");
      } catch (error) {
        toast.error(
          "A API de compartilhamento não é suportada neste navegador e houve um erro ao copiar o link.",
        );
      }
    }
  };

  if (!movie) {
    return (
      <div className="flex h-screen bg-black">
        <Sidebar />
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Sidebar />
      <div className="flex-grow md:ml-20 transition-all duration-300 ease-in-out">
        <div className="relative pt-16 md:pt-24 min-h-[calc(80vh)] md:min-h-[calc(90vh)] text-white bg-black">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${movie.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent md:w-3/4"></div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-end h-full pb-12 md:pb-20 pt-10 md:pt-0">
            <div className="md:w-1/3 lg:w-1/4 w-2/3 max-w-xs md:max-w-none mb-6 md:mb-0 md:mr-8 lg:mr-12 flex-shrink-0">
              <img
                src={movie.imageUrl}
                alt={`Poster de ${movie.name}`}
                className="rounded-lg shadow-2xl w-full h-auto object-cover aspect-[2/3]"
              />
            </div>

            <div className="flex-grow text-center md:text-left space-y-4 md:space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                {movie.name}
              </h1>

              <div className="flex items-center justify-center md:justify-start space-x-4 text-gray-300 text-sm sm:text-base">
                <div className="flex items-center">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-1.5" />
                  <span>{movie.rating}</span>
                </div>
                <span className="opacity-50">|</span>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-1.5" />
                  <span>{movie.year}</span>
                </div>
                <span className="opacity-50">|</span>
                <div className="flex items-center">
                  <Clapperboard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-1.5" />
                  <span className="capitalize">{movie.category}</span>
                </div>
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl line-clamp-4 md:line-clamp-5">
                {movie.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-3 pt-3">
                <button
                  onClick={toggleFavorite}
                  className={`w-full sm:w-auto px-6 py-3 font-semibold rounded-lg shadow-md flex items-center justify-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
                    ${
                      isFavorite
                        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        : "bg-gray-700 hover:bg-red-600 focus:ring-red-500"
                    } text-white`}
                >
                  {isFavorite ? (
                    <HeartOff size={20} className="mr-2" />
                  ) : (
                    <Heart size={20} className="mr-2" />
                  )}
                  <span>{isFavorite ? "Remover Favorito" : "Favoritar"}</span>
                </button>
                <button
                  onClick={handleCreateSession}
                  className="w-full sm:w-auto px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black flex items-center justify-center"
                >
                  <Popcorn size={20} className="mr-2" />
                  <span>Criar Sessão</span>
                </button>
                <button
                  onClick={handleShare}
                  className="w-full sm:w-auto px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-black flex items-center justify-center"
                >
                  <Share size={20} className="mr-2" />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {movie && movie.youtubeLink && (
          <section className="py-12 md:py-16 bg-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center">
                <PlayCircle size={28} className="mr-3 text-red-500" />
                Trailer Oficial
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden shadow-2xl border-2 border-gray-800">
                <iframe
                  src={movie.youtubeLink}
                  title={`Trailer de ${movie.name}`}
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </section>
        )}

        <section className="py-12 md:py-16 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center">
              <MessageSquare size={28} className="mr-3 text-sky-500" />
              Comentários e Discussões
            </h2>
            <Comments
              comments={comments}
              onCommentSubmit={handleCommentSubmit}
              onDeleteComment={handleDeleteComment}
            />
          </div>
        </section>

        <Footer />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </div>
  );
};

export default MovieDetailsPage;
