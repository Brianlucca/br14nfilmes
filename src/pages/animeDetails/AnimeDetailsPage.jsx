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
import { Calendar, Clapperboard, Star, Heart, HeartOff, Tv } from "lucide-react";

const AnimeDetailsPage = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [comments, setComments] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const animeRef = ref(database, `animes/${id}`);
        const snapshot = await get(animeRef);
        if (snapshot.exists()) {
          setAnime(snapshot.val());
        } else {
          toast.error("Anime não encontrado");
        }
      } catch (error) {
        toast.error("Erro ao buscar detalhes do anime");
      }
    };

    fetchAnimeDetails();
  }, [id]);

  useEffect(() => {
    const commentsRef = ref(database, `animes/${id}/comments`);
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
      const favoritesRef = ref(database, `users/${user.uid}/favorites/anime/${id}`);
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
      await push(ref(database, `animes/${id}/comments`), comment);
      toast.success("Comentário enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar comentário");
    }
  };

  const handleDeleteComment = async (commentKey) => {
    try {
      await remove(ref(database, `animes/${id}/comments/${commentKey}`));
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

    const favoriteRef = ref(database, `users/${user.uid}/favorites/anime/${id}`);

    try {
      if (isFavorite) {
        await remove(favoriteRef);
        toast.success("Anime removido dos favoritos");
        setIsFavorite(false);
      } else {
        await set(favoriteRef, {
          id,
          title: anime.name,
          imageUrl: anime.imageUrl,
          gif: anime.gif,
          addedAt: new Date().toISOString(),
        });
        toast.success("Anime adicionado aos favoritos");
        setIsFavorite(true);
      }
    } catch (error) {
      toast.error("Erro ao atualizar favoritos");
    }
  };

  const handleCreateSession = () => {
    navigate(`/create-session/${id}`);
  };

  if (!anime) {
    return <Loading />;
  }

  return (
    <div className="bg-black min-h-screen">
      <Sidebar />
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${anime.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#1a1a1a]/70 to-black"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8 text-white">
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-4xl font-bold">{anime.name}</h1>
            <p className="text-lg">{anime.description}</p>
            <p className="text-lg font-semibold flex items-center space-x-2">
              <Star className="hover:text-yellow-300" />
              {anime.rating}
            </p>
            <p className="text-lg font-semibold flex items-center space-x-2">
              <Clapperboard className="hover:text-red-300" />
              <span>{anime.category}</span>
            </p>
            <p className="text-lg font-semibold flex items-center space-x-2">
              <Calendar className="hover:text-blue-300" />
              <span>{anime.year}</span>
            </p>
            <div className="flex flex-col sm:flex-row sm:space-x-4 mt-6">
              <button
                onClick={toggleFavorite}
                className={`px-4 py-2 font-semibold rounded-md shadow-md flex items-center justify-center ${
                  isFavorite
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#605f5f] hover:bg-red-600"
                } text-white mb-2 sm:mb-0`}
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
                <Tv className="text-white mr-2" />
                <span>Assistir em Grupo</span>
              </button>
            </div>
            {anime.youtubeLink && (
              <div className="w-full md:w-3/4 lg:w-2/3 mt-8">
                <iframe
                  src={anime.youtubeLink}
                  title={`Trailer de ${anime.name}`}
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

export default AnimeDetailsPage;
