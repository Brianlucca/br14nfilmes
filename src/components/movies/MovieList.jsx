import { useEffect, useState } from 'react';
import { fetchMovies } from '../../services/movieService/MovieService';
import MovieItem from './MovieItem';
import Carousel from '../carousel/Carousel';
import Loading from '../loading/Loading';
import { Film } from 'lucide-react';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const moviesData = await fetchMovies();
        if (moviesData && typeof moviesData === 'object') {
          const sortedMovies = Object.entries(moviesData).sort(([, movieA], [, movieB]) => {
            // Prioritize movies with a name, then sort by name
            if (movieA.name && movieB.name) {
              return movieA.name.localeCompare(movieB.name);
            }
            if (movieA.name) return -1;
            if (movieB.name) return 1;
            return 0;
          });
          setMovies(sortedMovies);
        } else {
          setMovies([]);
          console.warn("Movies data is not in the expected format or is empty:", moviesData);
        }
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Não foi possível carregar os filmes no momento. Tente novamente mais tarde.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, []);

  // Dentro de MovieList.jsx
  const movieItems = movies.map(([id, movie]) => (
    <div
      key={id}
      className="w-48 h-[300px] sm:w-56 sm:h-[350px] md:w-[200px] md:h-[320px] lg:w-[225px] lg:h-[360px] xl:w-[240px] xl:h-[384px] flex-shrink-0 px-2.5 py-2"
    >
      <MovieItem movie={movie} id={id} />
    </div>
  ));
  if (loading) {
    return (
      <div className="flex-grow md:ml-20 py-8 md:py-10 text-center text-gray-400 transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-500 animate-pulse">
            Carregando Filmes...
          </h2>
          <div className="h-72 flex items-center justify-center text-gray-600">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow md:ml-20 py-8 md:py-10 text-center transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-red-500">
            Oops! Algo deu errado.
          </h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex-grow md:ml-20 py-8 md:py-10 text-center transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Film size={48} className="mx-auto text-gray-700 mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-500">
            Nenhum Filme Encontrado
          </h2>
          <p className="text-gray-600">Parece que não há filmes disponíveis no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow md:ml-20 py-8 md:py-10 text-gray-100 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5 sm:mb-8 text-white">
          Filmes Populares
        </h2>
        {movieItems.length > 0 ? (
          <Carousel items={movieItems} />
        ) : (
          <p className="text-center text-gray-500">Nenhum item de filme para exibir no carrossel.</p>
        )}
      </div>
    </div>
  );
};

export default MovieList;
