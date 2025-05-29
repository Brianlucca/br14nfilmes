import { get, getDatabase, ref, set } from "firebase/database";
import {
  Clapperboard,
  Film,
  Image as ImageIcon,
  Link2,
  MessageSquareText,
  Send,
} from "lucide-react";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/footer/Footer";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { auth } from "../../services/firebaseConfig/FirebaseConfig";

const Recommendations = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      toast.error("Usuário não autenticado. Por favor, faça login.");
      setIsSubmitting(false);
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    try {
      const db = getDatabase();
      const userId = auth.currentUser?.uid;

      if (!userId) {
        toast.error("Usuário não autenticado.");
        setIsSubmitting(false);
        return;
      }

      const userProfileRef = ref(db, `users/${userId}/updateNick/${userId}`);
      const userProfileSnapshot = await get(userProfileRef);
      const userProfileData = userProfileSnapshot.val();

      if (!userProfileData || !userProfileData.nickname) {
        toast.warn(
          "Por favor, crie um nickname no seu perfil antes de enviar uma recomendação.",
        );
        navigate("/profile", {
          state: { from: location.pathname, needsNickname: true },
        });
        setIsSubmitting(false);
        return;
      }

      const recommendationId = Date.now().toString();

      await set(ref(db, `recommendations/${recommendationId}`), {
        id: recommendationId,
        imageUrl,
        videoUrl,
        name,
        description,
        userId: userId,
        userName: userProfileData.nickname,
        userPhotoURL: auth.currentUser.photoURL || null,
        createdAt: new Date().toISOString(),
        status: "pending",
      });

      toast.success(
        "Recomendação enviada com sucesso! Obrigado por contribuir.",
      );

      setImageUrl("");
      setVideoUrl("");
      setName("");
      setDescription("");
    } catch (error) {
      toast.error("Erro ao enviar recomendação. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nameMaxLength = 150;
  const imageUrlMaxLength = 2000;
  const videoUrlMaxLength = 500;
  const descriptionMaxLength = 1000;

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Sidebar />
      <div className="flex-grow md:ml-20 transition-all duration-300 ease-in-out text-gray-300">
        <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-20 md:pt-8">
          <div className="w-full max-w-xl p-6 sm:p-8 bg-[#1c1c1c] shadow-2xl rounded-xl border border-gray-800">
            <div className="text-center mb-8">
              <Film size={48} className="mx-auto text-sky-500 mb-3" />
              <h1 className="text-3xl font-bold text-white">
                Recomendar um Conteúdo
              </h1>
              <p className="text-gray-400 mt-2">
                Compartilhe seus achados favoritos com a comunidade!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Título do Conteúdo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clapperboard size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Interestelar, Breaking Bad"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    required
                    maxLength={nameMaxLength}
                  />
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {name.length}/{nameMaxLength}
                </div>
              </div>

              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  URL da Imagem (Poster/Capa)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    required
                    maxLength={imageUrlMaxLength}
                  />
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {imageUrl.length}/{imageUrlMaxLength}
                </div>
              </div>

              <div>
                <label
                  htmlFor="videoUrl"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  URL do Vídeo (Trailer no YouTube - Link de Embed)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link2 size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="url"
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Ex: https://www.youtube.com/embed/VIDEO_ID"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    required
                    maxLength={videoUrlMaxLength}
                  />
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {videoUrl.length}/{videoUrlMaxLength}
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Breve Descrição / Por que você recomenda?
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <MessageSquareText size={18} className="text-gray-500" />
                  </div>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Conte um pouco sobre o filme, série ou anime e por que outros deveriam assistir..."
                    rows="4"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 resize-none"
                    required
                    maxLength={descriptionMaxLength}
                  />
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {description.length}/{descriptionMaxLength}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Enviar Recomendação
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        <Footer />
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
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

export default Recommendations;