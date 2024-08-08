import { Link } from "react-router-dom";

const MovieItem = ({ movie, id }) => {
  return (
    <div className="">
      <Link to={`/movie/${id}`} className="w-full">
        <img
          src={movie.imageUrl}
          alt={movie.name}
          className="w-48 h-72 object-cover rounded-lg m-5"
        />
        <h3 className="text-lg font-semibold text-gray-800 mt-2 text-center">{movie.name}</h3>
      </Link>
    </div>
  );
};

export default MovieItem;
