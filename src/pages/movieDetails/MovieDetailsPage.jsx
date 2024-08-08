import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, get } from "firebase/database";
import { database } from "../../services/firebaseConfig/FirebaseConfig";
import Sidebar from "../../components/sidebar/Sidebar";
import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieRef = ref(database, `movies/${id}`);
        const snapshot = await get(movieRef);
        if (snapshot.exists()) {
          setMovie(snapshot.val());
        } else {
          console.error("Filme não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg space-y-8">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <img
            src={movie.imageUrl}
            alt={movie.name}
            className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow-md mb-6 md:mb-0"
          />
          <div className="md:w-2/3 space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">{movie.name}</h1>
            <p className="text-lg text-gray-700">{movie.description}</p>
            <p className="text-lg text-gray-800 font-semibold">Avaliação: {movie.rating}</p>
            {movie.youtubeLink && (
              <div className="mt-6">
                <iframe
                  src={movie.youtubeLink}
                  title={`Trailer de ${movie.name}`}
                  width="100%"
                  height="315"
                  className="rounded-lg shadow-md"
                  allow="fullscreen"
                />
              </div>
            )}
            <div className="flex space-x-4 mt-6">
              <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600">
                ❤️ Favoritos
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600">
                📺 Assistir Mais Tarde
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg my-8 space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800">Comentários</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <p className="text-gray-800">
              <strong>Usuário 1:</strong> Excelente filme! Gostei muito.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <p className="text-gray-800">
              <strong>Usuário 2:</strong> A história é muito envolvente, recomendo!
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <p className="text-gray-800">
              <strong>Usuário 3:</strong> Ótimos efeitos visuais, mas achei o final fraco.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetailsPage;
