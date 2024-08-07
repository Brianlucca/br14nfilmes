import { Link } from "react-router-dom";

const MovieItem = ({ movie, id }) => {
  return (
    <div className="movie-item flex flex-col items-center bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out p-2">
      <Link to={`/movie/${id}`} className="w-full">
        <img
          src={movie.imageUrl}
          alt={movie.name}
          className="w-48 h-72 object-cover rounded-lg"
        />
        <h3 className="text-lg font-semibold text-gray-800 mt-2 text-center">{movie.name}</h3>
      </Link>
    </div>
  );
};

export default MovieItem;
