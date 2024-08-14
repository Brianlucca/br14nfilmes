import { get, ref, set } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { database } from "../../services/firebaseConfig/FirebaseConfig";

const CreateSession = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [sessionName, setSessionName] = useState("");
  const [description, setDescription] = useState("");
  const [isSeries, setIsSeries] = useState(false);
  const [episodes, setEpisodes] = useState(0);
  const [content, setContent] = useState(null);
  const [sessionCode, setSessionCode] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Add state for imageUrl
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const categories = ["movies", "series", "animes", "musics"];
        let found = false;

        for (const category of categories) {
          const categoryRef = ref(database, category);
          const snapshot = await get(categoryRef);

          if (snapshot.exists()) {
            const data = snapshot.val();
            for (const [key, value] of Object.entries(data)) {
              if (key === id) {
                setContent(value);
                setSessionName(value.name);
                setDescription(value.description);
                setImageUrl(value.imageUrl || ""); // Set imageUrl

                if (value.type === "serie" || value.type === "anime") {
                  setIsSeries(true);
                  if (value.type === "serie") {
                    setEpisodes(value.episodes || 0);
                  }
                }
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }

        if (!found) {
          toast.error("Conteúdo não encontrado");
        }
      } catch (error) {
        toast.error("Erro ao buscar informações do conteúdo");
      }
    };

    fetchContent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Você precisa estar logado para criar uma sessão");
      navigate('/login');
      return;
    }

    const userRef = ref(database, `users/${user.uid}/updateNick/${user.uid}`);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();

    if (!userData || !userData.nickname) {
      toast.warn("Por favor, crie um nickname antes de criar uma sessão.");
      navigate('/profile', { state: { from: location.pathname } });
      return;
    }

    const generatedSessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newSession = {
      sessionName,
      description,
      isSeries,
      episodes: isSeries ? episodes : null,
      sessionCode: generatedSessionCode,
      createdBy: userData.nickname,
      createdAt: new Date().toISOString(),
      image: imageUrl, // Use imageUrl here
      contentId: id,
    };

    try {
      const sessionRef = ref(database, `sessions/${generatedSessionCode}`);
      await set(sessionRef, newSession);
      setSessionCode(generatedSessionCode);
      toast.success("Sessão criada com sucesso!");
      navigate(`/watchsession/${generatedSessionCode}`);
    } catch (error) {
      toast.error("Erro ao criar a sessão");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar className="lg:w-1/4" />
      <div className="flex-1 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg lg:max-w-4xl lg:mx-6 lg:py-8">
        {content && (
          <div className="mb-6">
            <img
              src={content.imageUrl}
              alt={content.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{content.name}</h2>
            <p className="text-gray-700">{content.description}</p>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-6">Criar Sessão</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nome da Sessão
            </label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-4 border rounded-lg focus:outline-none"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={isSeries}
              onChange={() => setIsSeries(!isSeries)}
              className="form-checkbox"
            />
            <label className="ml-2 text-gray-700">É uma série ou anime?</label>
          </div>
          {isSeries && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quantidade de Episódios
              </label>
              <input
                type="number"
                value={episodes}
                onChange={(e) => setEpisodes(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                min="1"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
          >
            Criar Sessão
          </button>
        </form>
        {sessionCode && (
          <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-lg">
            <h2 className="text-lg font-semibold">Código da Sessão:</h2>
            <p className="text-gray-700">{sessionCode}</p>
            <p className="text-gray-600">Compartilhe este código com seus colegas para que eles possam se juntar à sessão.</p>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default CreateSession;
