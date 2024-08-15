import { Link } from "react-router-dom";

const AnimeItem = ({ anime, id }) => {
  return (
    <div className="relative group flex flex-col items-center justify-center sm:items-start sm:justify-start m-2">
      <Link to={`/anime/${id}`} className="relative">
        <img
          src={anime.imageUrl}
          alt={anime.name}
          className="w-36 h-56 sm:w-48 sm:h-72 object-cover rounded-lg shadow-lg transition-transform transform group-hover:scale-105 duration-300 ease-in-out"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg flex items-center justify-center">
          <div className="text-center text-white text-xs sm:text-sm max-h-24 overflow-hidden px-2">
            <p className="font-bold">{anime.name || "Título do anime"}</p>
            <p className="font-bold text-red-300">{anime.rating || "sem avaliação"}</p>
            <p className="font-bold text-gray-400">{anime.category || ""}</p>
            <p className="font-bold text-gray-400">{anime.year || ""}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimeItem;
