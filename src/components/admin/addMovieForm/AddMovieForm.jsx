import { get, getDatabase, ref } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/authContext/AuthContext";
import { addMovie } from "../../../services/movieService/MovieService";

const AddMovieForm = () => {
  const { user } = useContext(AuthContext);
  const [movieData, setMovieData] = useState({
    name: "",
    imageUrl: "",
    youtubeLink: "",
    description: "",
    rating: ""
  });
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const userId = user.uid;

      get(ref(db, `users/${userId}/role`)).then((snapshot) => {
        const role = snapshot.val();
        setIsUserAdmin(role === 'admin');
      }).catch((error) => {
        console.error('Erro ao verificar papel de usuário:', error);
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !isUserAdmin) {
      console.error("Acesso negado. Apenas administradores podem adicionar filmes.");
      return;
    }

    try {
      const movieWithUser = { 
        ...movieData, 
        userEmail: user.email
      };
      await addMovie(movieWithUser);
      setSuccessMessage(`Filme "${movieData.name}" foi adicionado.`);
      setMovieData({
        name: "",
        imageUrl: "",
        youtubeLink: "",
        description: "",
        rating: ""
      });
    } catch (error) {
      console.error("Erro ao adicionar filme", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10 px-4">
      <div className="w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl p-8 bg-white shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 text-center">Adicionar Filme</h2>
        
        {successMessage && (
          <p className="text-green-500 text-center mb-6 font-medium">{successMessage}</p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm sm:text-base font-medium mb-2">Nome do Filme</label>
            <input
              id="name"
              name="name"
              type="text"
              value={movieData.name}
              onChange={handleChange}
              placeholder="Nome do Filme"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-gray-700 text-sm sm:text-base font-medium mb-2">Link da Imagem</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="text"
              value={movieData.imageUrl}
              onChange={handleChange}
              placeholder="Link da Imagem"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="youtubeLink" className="block text-gray-700 text-sm sm:text-base font-medium mb-2">Link do Trailer</label>
            <input
              id="youtubeLink"
              name="youtubeLink"
              type="text"
              value={movieData.youtubeLink}
              onChange={handleChange}
              placeholder="Link do Trailer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm sm:text-base font-medium mb-2">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={movieData.description}
              onChange={handleChange}
              placeholder="Descrição"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="rating" className="block text-gray-700 text-sm sm:text-base font-medium mb-2">Avaliação</label>
            <input
              id="rating"
              name="rating"
              type="text"
              value={movieData.rating}
              onChange={handleChange}
              placeholder="Avaliação"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Adicionar Filme
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMovieForm;
