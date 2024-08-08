import { useEffect, useState } from 'react';
import { fetchMovies } from '../../services/movieService/MovieService';
import MovieItem from './MovieItem';
import Carousel from '../carousel/Carousel'; 

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const moviesData = await fetchMovies();
        setMovies(Object.entries(moviesData));
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
      }
    };

    getMovies();
  }, []);

  const movieItems = movies.map(([id, movie]) => (
    <div key={id} className="w-60 flex-shrink-0">
      <MovieItem movie={movie} id={id} />
    </div>
  ));

  return (
    <div className="ml-16 lg:ml-20 p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Filmes</h1>
      <Carousel items={movieItems} />
    </div>
  );
};

export default MovieList;
