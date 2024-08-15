import { Link } from "react-router-dom";

const MovieItem = ({ movie, id }) => {
  return (
    <div className="relative group flex flex-col items-center justify-center sm:items-start sm:justify-start m-2">
      <Link to={`/movie/${id}`} className="relative">
        <img
          src={movie.imageUrl}
          alt={movie.name}
          className="w-36 h-56 sm:w-48 sm:h-72 object-cover rounded-lg shadow-lg transition-transform transform group-hover:scale-105 duration-300 ease-in-out"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg flex items-center justify-center">
          <div className="text-center text-white text-xs sm:text-sm max-h-24 overflow-hidden px-2">
            <p className="font-bold">{movie.name || "Título do filme"}</p>
            <p className="font-bold text-red-300">{movie.rating || "sem avaliação"}</p>
            <p className="font-bold text-gray-400">{movie.category || ""}</p>
            <p className="font-bold text-gray-400">{movie.year || ""}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieItem;
