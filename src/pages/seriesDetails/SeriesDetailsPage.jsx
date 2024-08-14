import { get, ref, onValue, remove, push } from "firebase/database";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Comments from "../../components/comments/Comments";
import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";
import Sidebar from "../../components/sidebar/Sidebar";
import { database } from "../../services/firebaseConfig/FirebaseConfig";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";

const SeriesDetailsPage = () => {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [comments, setComments] = useState([]);
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
      replyingToName: replyingTo ? (comments.find(([key]) => key === replyingTo)[1].userName) : null
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

  const handleCreateSession = () => {
    navigate(`/create-session/${id}`)
  }


  if (!series) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-white shadow-lg rounded-lg space-y-8">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <img
            src={series.imageUrl}
            alt={series.name}
            className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow-md mb-6 md:mb-0"
          />
          <div className="md:w-2/3 space-y-4 p-4">
            <h1 className="text-4xl font-bold text-gray-800">{series.name}</h1>
            <p className="text-lg text-gray-700">{series.description}</p>
            <p className="text-lg text-gray-800 font-semibold">Avaliação: {series.rating}</p>
            <p className="text-lg text-gray-800 font-semibold">Categoria: {series.category}</p>
            {series.youtubeLink && (
              <div className="mt-6">
                <iframe
                  src={series.youtubeLink}
                  title={`Trailer de ${series.name}`}
                  width="100%"
                  height="315"
                  className="rounded-lg shadow-md"
                  allow="fullscreen"
                />
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:space-x-4 mt-6">
              <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 mb-2 sm:mb-0">
                ❤️ Favoritos
              </button>
              <button
              onClick={handleCreateSession}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600">
                📺 Assistir em Grupo
              </button>
            </div>
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
