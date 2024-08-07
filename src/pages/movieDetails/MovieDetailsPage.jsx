import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, get } from "firebase/database";
import { database } from "../../services/firebaseConfig/FirebaseConfig";

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
    return <div className="text-center text-gray-500">Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row md:space-x-6">
        <img
          src={movie.imageUrl}
          alt={movie.name}
          className="w-full md:w-1/3 h-auto object-cover rounded-lg mb-6 md:mb-0"
        />
        <div className="md:w-2/3">
          <h1 className="text-3xl font-semibold mb-4 text-gray-800">{movie.name}</h1>
          <p className="text-lg text-gray-700 mb-4">{movie.description}</p>
          <p className="text-lg text-gray-800 font-semibold">Avaliação: {movie.rating}</p>
          {movie.youtubeLink && (
            <div className="mt-6">
              <iframe
                src={movie.youtubeLink}
                title={`Trailer de ${movie.name}`}
                width="100%"
                height="315"
                className="rounded-lg"
                allow="fullscreen"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
