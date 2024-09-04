import { Link } from "react-router-dom";

const MusicItem = ({ music, id }) => {
  return (
    <article className="relative group flex flex-col items-center justify-center sm:items-start sm:justify-start m-2">
      <Link to={`/music/${id}`} aria-label={`Ver detalhes da música ${music.name || "Título da música"}`} className="relative">
        <figure>
          <img
            src={music.imageUrl}
            alt={`Capa da música ${music.name}`}
            className="w-36 h-56 sm:w-48 sm:h-72 object-cover rounded-lg shadow-2xl transform transition-transform group-hover:scale-110 duration-500 ease-out"
          />
          <figcaption className="sr-only">{music.name}</figcaption>
        </figure>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-lg flex items-end justify-center p-4">
          <div className="text-center text-white text-xs sm:text-sm max-h-24 overflow-hidden">
            <h3 className="font-bold text-xl">{music.name || "Título da música"}</h3>
            <p className="font-bold text-red-500">{music.rating || "Sem avaliação"}</p>
            <p className="text-gray-300">{music.category || "Categoria"}</p>
            <p className="text-gray-300">{music.year || "Ano"}</p>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default MusicItem;
