import { Link } from "react-router-dom";

const AnimeItem = ({ anime, id }) => {
  return (
    <div className="flex justify-center sm:justify-start">
      <Link to={`/anime/${id}`} className="w-full">
        <img
          src={anime.imageUrl}
          alt={anime.name}
          className="w-36 h-56 sm:w-48 sm:h-72 object-cover rounded-lg m-2 sm:m-5"
        />
      </Link>
    </div>
  );
};

export default AnimeItem;
