import { Link } from "react-router-dom";

const MovieItem = ({ movie, id }) => {
  return (
    <div className="flex justify-center sm:justify-start">
      <Link to={`/movie/${id}`} className="w-full">
        <img
          src={movie.imageUrl}
          alt={movie.name}
          className="w-36 h-56 sm:w-48 sm:h-72 object-cover rounded-lg m-2 sm:m-5"
        />
      </Link>
    </div>
  );
};

export default MovieItem;
