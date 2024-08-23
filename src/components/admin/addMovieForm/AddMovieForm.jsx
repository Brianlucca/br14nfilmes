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
    driveLink: "",
    gif: "",
    description: "",
    rating: "",
    year: "",
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
          selectedCategories = ['Ação', 'Comédia', 'Drama', 'Terror', 'Romance', 'Ficção Científica', 'Documentário', 'Aventura', 'super-herói', 'Horror', 'Suspense', 'Sci-Fi', 'Fantasia', 'Mistério', 'Crime'];
          break;
        case 'music':
          selectedCategories = ['Rock', 'Pop', 'Hip-hop', 'Jazz', 'Clássica', 'Eletrônica', 'Blues', 'Country', 'Funk', 'Rap', 'MPB'];
          break;
        case 'anime':
          selectedCategories = ['Shounen', 'Seinen', 'Shojo', 'Isekai', 'Mecha', 'Slice of Life', 'Horror', 'Comédia', 'super-herói', 'Cientifica', 'Cyberpunk', 'Futurístico'];
          break;
        case 'serie':
          selectedCategories = ['Ação', 'Comédia', 'Drama', 'Terror', 'Romance', 'Ficção Científica', 'Documentário', 'Aventura', 'super-herói', 'Horror', 'Suspense', 'Sci-Fi', 'Fantasia', 'Mistério', 'Crime'];
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
        driveLink: "",
        gif: "",
        description: "",
        rating: "",
        year: "",
        type: "",
        category: ""
      });
      setCategories([]);
    } catch (error) {
      toast.error("Ocorreu um erro ao adicionar o conteúdo. Tente novamente.");
    }
  };

  return (
    <div className="w-full bg-[#1a1a1a] shadow-lg rounded-lg p-6">
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
          <label htmlFor="driveLink" className="block text-gray-300 text-sm font-medium mb-2">Link do Google Drive (Opcional)</label>
          <input
            id="driveLink"
            name="driveLink"
            type="text"
            value={contentData.driveLink}
            onChange={handleChange}
            placeholder="Link do Google Drive (Opcional)"
            className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="driveLink" className="block text-gray-300 text-sm font-medium mb-2">Link do Gif (Opcional)</label>
          <input
            id="gif"
            name="gif"
            type="text"
            value={contentData.gif}
            onChange={handleChange}
            placeholder="Link do Gif (Opcional)"
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
          <label htmlFor="year" className="block text-gray-300 text-sm font-medium mb-2">Ano</label>
          <input
            id="year"
            name="year"
            type="text"
            value={contentData.year}
            onChange={handleChange}
            placeholder="Ano"
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

        {contentData.type && (
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
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="py-2 px-4 rounded-lg bg-[#605f5f] text-white font-semibold hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
          >
            Adicionar Conteúdo
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddContentForm;
