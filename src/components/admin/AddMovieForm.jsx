import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { addMovie } from "../../services/movieService/MovieService";

const AddMovieForm = () => {
  const { user } = useContext(AuthContext);
  const [movieData, setMovieData] = useState({
    name: "",
    imageUrl: "",
    youtubeLink: "",
    description: "",
    rating: ""
  });

  const handleChange = (e) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("Usuário não está autenticado.");
      return;
    }

    try {
      const movieWithUser = { 
        ...movieData, 
        userEmail: user.email
      };
      await addMovie(movieWithUser);
      // Redirecionar ou mostrar mensagem de sucesso
    } catch (error) {
      console.error("Erro ao adicionar filme", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Adicionar Filme</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Nome do Filme</label>
        <input
          id="name"
          name="name"
          type="text"
          value={movieData.name}
          onChange={handleChange}
          placeholder="Nome do Filme"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="imageUrl">Link da Imagem</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          value={movieData.imageUrl}
          onChange={handleChange}
          placeholder="Link da Imagem"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="youtubeLink">Link do trailer</label>
        <input
          id="youtubeLink"
          name="youtubeLink"
          value={movieData.youtubeLink}
          onChange={handleChange}
          placeholder="Link do trailer"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          value={movieData.description}
          onChange={handleChange}
          placeholder="Descrição"
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="rating">Avaliação</label>
        <input
          id="rating"
          name="rating"
          type="text"
          value={movieData.rating}
          onChange={handleChange}
          placeholder="Avaliação"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Adicionar Filme
      </button>
    </form>
  );
};

export default AddMovieForm;
