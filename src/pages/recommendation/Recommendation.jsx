import { useState, useEffect, useContext } from "react";
import { getDatabase, ref, set, get } from "firebase/database";
import { auth } from "../../services/firebaseConfig/FirebaseConfig";
import Footer from "../../components/footer/Footer";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

const Recommendations = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Usuário não autenticado.");
      return;
    }

    try {
      const db = getDatabase();
      const userId = auth.currentUser?.uid;

      if (!userId) {
        toast.error("Usuário não autenticado.");
        return;
      }

      const roleRef = ref(db, `users/${userId}/updateNick/${userId}`);
      const roleSnapshot = await get(roleRef);
      const roleData = roleSnapshot.val();

      if (!roleData || !roleData.nickname) {
        toast.warn("Por favor, crie um nickname antes de enviar uma recomendação.");
        navigate("/profile", { state: { from: location.pathname } });
        return;
      }

      const recommendationId = Date.now();

      await set(ref(db, `recommendations/${recommendationId}`), {
        imageUrl,
        videoUrl,
        name,
        description,
        userName: roleData.nickname,
      });

      toast.success("Recomendação enviada com sucesso!");

      setImageUrl("");
      setVideoUrl("");
      setName("");
      setDescription("");
    } catch (error) {
      toast.error("Erro ao enviar recomendação. Tente novamente.");
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <Sidebar />
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-md p-6 bg-[#1a1a1a] shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">Recomendar um Titulo</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">Titulo</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o Titulo"
                className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-gray-300 text-sm font-medium mb-2">URL da Imagem</label>
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Digite a URL da imagem"
                className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="videoUrl" className="block text-gray-300 text-sm font-medium mb-2">URL do Vídeo</label>
              <input
                type="text"
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Digite a URL do vídeo"
                className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-2">Descrição</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição do vídeo"
                className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#605f5f] text-white font-semibold rounded-lg hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
            >
              Enviar Recomendação
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Recommendations;
