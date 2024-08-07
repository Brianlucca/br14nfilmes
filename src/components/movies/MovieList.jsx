import { useEffect, useState } from "react";
import { fetchMovies } from "../../services/movieService/MovieService";
import MovieItem from "./MovieItem";

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const moviesData = await fetchMovies();
        setMovies(Object.entries(moviesData)); 
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
    };

    getMovies();
  }, []);

  return (
    <div className="movie-list flex overflow-x-auto py-4 space-x-4">
      {movies.map(([id, movie]) => (
        <MovieItem key={id} movie={movie} id={id} />
      ))}
    </div>
  );
};

export default MovieList;
