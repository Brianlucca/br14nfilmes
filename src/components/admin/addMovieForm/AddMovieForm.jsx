import { useContext, useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { AuthContext } from "../../../contexts/authContext/AuthContext";
import { addMovie } from "../../../services/movieService/MovieService";
import { addMusic } from "../../../services/musicService/MusicService";
import { addAnime } from "../../../services/animeService/AnimeService";
import { addSeries } from "../../../services/seriesService/SeriesService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddContentForm = () => {
  const { user } = useContext(AuthContext);
  const [contentData, setContentData] = useState({
    name: "",
    imageUrl: "",
    youtubeLink: "",
    description: "",
    rating: "",
    type: "",
    category: ""
  });
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const userId = user.uid;

      get(ref(db, `users/${userId}/role`)).then((snapshot) => {
        const role = snapshot.val();
        setIsUserAdmin(role === 'admin');
      }).catch((error) => {
        toast.error("Erro ao verificar o papel do usuário.");
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'type') {
      let selectedCategories = [];
      switch (value) {
        case 'movie':
          selectedCategories = ['Ação', 'Comédia', 'Drama', 'Terror', 'Romance', 'Ficção Científica'];
          break;
        case 'music':
          selectedCategories = ['Rock', 'Pop', 'Hip-hop', 'Jazz', 'Clássica', 'Eletrônica'];
          break;
        case 'anime':
          selectedCategories = ['Shounen', 'Seinen', 'Shojo', 'Isekai', 'Mecha', 'Slice of Life'];
          break;
        case 'serie':
          selectedCategories = ['Drama', 'Comédia', 'Mistério', 'Suspense', 'Sci-Fi', 'Fantasia'];
          break;
        default:
          selectedCategories = [];
      }
      setCategories(selectedCategories);

      setContentData((prevData) => ({
        ...prevData,
        type: value,
        category: ""
      }));
    } else {
      setContentData({ ...contentData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !isUserAdmin) {
      toast.error("Você precisa ser um administrador para adicionar conteúdo.");
      return;
    }

    try {
      const contentWithUser = { 
        ...contentData, 
        userEmail: user.email
      };

      switch (contentData.type) {
        case 'movie':
          await addMovie(contentWithUser);
          break;
        case 'music':
          await addMusic(contentWithUser);
          break;
        case 'anime':
          await addAnime(contentWithUser);
          break;
        case 'serie':
          await addSeries(contentWithUser);
          break;
        default:
          throw new Error('Tipo de conteúdo inválido.');
      }

      toast.success(`"${contentData.name}" foi adicionado.`);
      setContentData({
        name: "",
        imageUrl: "",
        youtubeLink: "",
        description: "",
        rating: "",
        type: "",
        category: ""
      });
      setCategories([]);
    } catch (error) {
      toast.error("Ocorreu um erro ao adicionar o conteúdo. Tente novamente.");
    }
  };

  return (
    <div className="w-full bg-[#1a1a1a] k shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Adicionar Conteúdo</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            value={contentData.name}
            onChange={handleChange}
            placeholder="Nome"
            className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-gray-300 text-sm font-medium mb-2">Link da Imagem</label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            value={contentData.imageUrl}
            onChange={handleChange}
            placeholder="Link da Imagem"
            className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="youtubeLink" className="block text-gray-300 text-sm font-medium mb-2">Link do Trailer</label>
          <input
            id="youtubeLink"
            name="youtubeLink"
            type="text"
            value={contentData.youtubeLink}
            onChange={handleChange}
            placeholder="Link do Trailer"
            className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-2">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={contentData.description}
            onChange={handleChange}
            placeholder="Descrição"
            rows="4"
            className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="rating" className="block text-gray-300 text-sm font-medium mb-2">Avaliação</label>
          <input
            id="rating"
            name="rating"
            type="text"
            value={contentData.rating}
            onChange={handleChange}
            placeholder="Avaliação"
            className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="type" className="block text-gray-300 text-sm font-medium mb-2">Tipo</label>
          <select
            id="type"
            name="type"
            value={contentData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
          >
            <option value="">Selecione um tipo</option>
            <option value="movie">Filme</option>
            <option value="music">Música</option>
            <option value="anime">Anime</option>
            <option value="serie">Série</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="category" className="block text-gray-300 text-sm font-medium mb-2">Categoria</label>
          <select
            id="category"
            name="category"
            value={contentData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#605f5f] text-white font-semibold rounded-lg hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
        >
          Adicionar Conteúdo
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddContentForm;
