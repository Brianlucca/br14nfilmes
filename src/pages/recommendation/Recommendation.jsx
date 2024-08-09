import { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { auth } from "../../services/firebaseConfig/FirebaseConfig";
import Footer from "../../components/footer/Footer";
import Sidebar from "../../components/sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Recommendations = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getDatabase();
      const userId = auth.currentUser?.uid;
      const userEmail = auth.currentUser?.email; 

      if (!userId) {
        toast.error("Usuário não autenticado.");
        return;
      }

      const recommendationId = Date.now();

      await set(ref(db, `recommendations/${recommendationId}`), {
        userId,
        userEmail,
        imageUrl,
        videoUrl,
        name,
        description,
      });

      toast.success("Recomendação enviada com sucesso!");

      setImageUrl("");
      setVideoUrl("");
      setName("");
      setDescription("");
    } catch (error) {
      toast.error("Erro ao enviar recomendação. Tente novamente.");
      console.error("Erro ao enviar recomendação", error);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Recomendar um Titulo</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Titulo</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o Titulo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-medium mb-2">URL da Imagem</label>
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Digite a URL da imagem"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="videoUrl" className="block text-gray-700 text-sm font-medium mb-2">URL do Vídeo</label>
              <input
                type="text"
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Digite a URL do vídeo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Descrição</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição do vídeo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
