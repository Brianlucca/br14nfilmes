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
import { Calendar, Clapperboard, Star, Heart, HeartOff} from "lucide-react";

const MusicDetailsPage = () => {
  const { id } = useParams();
  const [music, setMusic] = useState(null);
  const [comments, setComments] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMusicDetails = async () => {
      try {
        const musicRef = ref(database, `musics/${id}`);
        const snapshot = await get(musicRef);
        if (snapshot.exists()) {
          setMusic(snapshot.val());
        } else {
          toast.error("Música não encontrada");
        }
      } catch (error) {
        toast.error("Erro ao buscar detalhes da música");
      }
    };

    fetchMusicDetails();
  }, [id]);

  useEffect(() => {
    const commentsRef = ref(database, `musics/${id}/comments`);
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
      const favoritesRef = ref(database, `users/${user.uid}/favorites/music/${id}`);
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
      await push(ref(database, `musics/${id}/comments`), comment);
      toast.success("Comentário enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar comentário");
    }
  };

  const handleDeleteComment = async (commentKey) => {
    try {
      await remove(ref(database, `musics/${id}/comments/${commentKey}`));
      toast.success("Comentário deletado com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar comentário");
    }
  };

  const handleCreateSession = () => {
    navigate(`/create-session/${id}`);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }

    const favoriteRef = ref(database, `users/${user.uid}/favorites/music/${id}`);

    try {
      if (isFavorite) {
        await remove(favoriteRef);
        setIsFavorite(false);
        toast.success("Música removida dos favoritos");
      } else {
        await set(favoriteRef, {
          id,
          title: music.name,
          imageUrl: music.imageUrl,
          gif: music.gif,
          addedAt: new Date().toISOString(),
        });
        setIsFavorite(true);
        toast.success("Música adicionada aos favoritos");
      }
    } catch (error) {
      toast.error("Erro ao atualizar favoritos");
    }
  };

  if (!music) {
    return <Loading />;
  }

  return (
    <div>
      <Sidebar />
      <div className="bg-black min-h-screen">
        <div className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${music.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#1a1a1a]/70 to-black"></div>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8 text-white">
            <div className="flex flex-col items-center text-center space-y-6">
              <h1 className="text-4xl font-bold">{music.name}</h1>
              <p className="text-lg">{music.description}</p>
              <p className="text-lg font-semibold flex items-center space-x-2">
                <Star className="hover:text-yellow-300" />
                {music.rating}
              </p>
              <p className="text-lg font-semibold flex items-center space-x-2">
                <Clapperboard className="hover:text-red-300" />
                <span>{music.category}</span>
              </p>
              <p className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="hover:text-blue-300" />
                <span>{music.year}</span>
              </p>
              <div className="flex flex-col sm:flex-row sm:space-x-4 mt-6">
                <button
                  onClick={handleToggleFavorite}
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
              </div>
              {music.youtubeLink && (
                <div className="w-full md:w-3/4 lg:w-2/3 mt-8">
                  <iframe
                    src={music.youtubeLink}
                    title={`Vídeo de ${music.name}`}
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

export default MusicDetailsPage;
