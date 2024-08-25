import { get, ref, onValue, remove, push, set } from "firebase/database";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Comments from "../../components/comments/Comments";
import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";
import Sidebar from "../../components/sidebar/Sidebar";
import { database } from "../../services/firebaseConfig/FirebaseConfig";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Calendar, Clapperboard, Star, Heart, HeartOff, Popcorn } from "lucide-react";

const SeriesDetailsPage = () => {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [comments, setComments] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      try {
        const seriesRef = ref(database, `series/${id}`);
        const snapshot = await get(seriesRef);
        if (snapshot.exists()) {
          setSeries(snapshot.val());
        } else {
          toast.error("Série não encontrada");
        }
      } catch (error) {
        toast.error("Erro ao buscar detalhes da série");
      }
    };

    fetchSeriesDetails();
  }, [id]);

  useEffect(() => {
    const commentsRef = ref(database, `series/${id}/comments`);
    onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val();
      if (commentsData) {
        setComments(Object.entries(commentsData));
      } else {
        setComments([]);
      }
    });
  }, [id]);

  useEffect(() => {
    if (user) {
      const favoritesRef = ref(database, `users/${user.uid}/favorites/serie/${id}`);
      onValue(favoritesRef, (snapshot) => {
        setIsFavorite(snapshot.exists());
      });
    }
  }, [id, user]);

  const handleCommentSubmit = async (commentText, replyingTo) => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }

    const roleRef = ref(database, `users/${user.uid}/updateNick/${user.uid}`);
    const roleSnapshot = await get(roleRef);
    const roleData = roleSnapshot.val();

    if (!roleData || !roleData.nickname) {
      toast.warn("Por favor, crie um nickname antes de comentar.");
      navigate("/profile", { state: { from: location.pathname } });
      return;
    }

    const comment = {
      text: commentText,
      userName: roleData.nickname,
      createdAt: new Date().toISOString(),
      replyingToName: replyingTo
        ? comments.find(([key]) => key === replyingTo)[1].userName
        : null,
    };

    try {
      await push(ref(database, `series/${id}/comments`), comment);
      toast.success("Comentário enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar comentário");
    }
  };

  const handleDeleteComment = async (commentKey) => {
    try {
      await remove(ref(database, `series/${id}/comments/${commentKey}`));
      toast.success("Comentário deletado com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar comentário");
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }
  
    const favoriteRef = ref(database, `users/${user.uid}/favorites/serie/${id}`);
  
    try {
      if (isFavorite) {
        await remove(favoriteRef);
        toast.success("Série removida dos favoritos");
        setIsFavorite(false);
      } else {
        await set(favoriteRef, {
          id,
          title: series.name,
          imageUrl: series.imageUrl,
          gif: series.gif,
          addedAt: new Date().toISOString(),
        });
        toast.success("Série adicionada aos favoritos");
        setIsFavorite(true);
      }
    } catch (error) {
      toast.error("Erro ao atualizar favoritos");
    }
  };
  
  const handleCreateSession = () => {
    navigate(`/create-session/${id}`);
  };

  if (!series) {
    return <Loading />;
  }

  return (
    <div className="bg-black min-h-screen">
      <Sidebar />
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
              {series.rating}
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
                <span>Assistir</span>
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
  );
};

export default SeriesDetailsPage;
