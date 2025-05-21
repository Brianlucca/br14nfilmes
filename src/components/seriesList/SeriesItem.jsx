import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Tv, PlayCircle, ChevronRight } from "lucide-react";

const SeriesItem = ({ series, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageToShow = isHovered && series.gif ? series.gif : series.imageUrl;
  const displayPlaceholder = imageError || !imageToShow;

  return (
    <Link
      to={`/serie/${id}`}
      aria-label={`Ver detalhes da série ${series.name || "Título indisponível"}`}
      className="relative block w-full h-full bg-[#101014] rounded-md overflow-hidden shadow-lg group transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/30 hover:border-emerald-600/60 border border-gray-700/50 focus:outline-none focus:shadow-xl focus:shadow-emerald-500/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayPlaceholder ? (
        <div className="w-full h-full flex items-center justify-center bg-[#1c1c22] rounded-md">
          <Tv size={64} className="text-gray-600" />
        </div>
      ) : (
        <img
          src={imageToShow}
          alt={`Poster de ${series.name || "Série"}`}
          className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all duration-300 ease-in-out group-hover:bg-black/40"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transition-all duration-500 ease-out transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
        <div className="bg-black/75 backdrop-blur-md p-3 sm:p-4 rounded-t-md transform transition-all duration-500 ease-out delay-100">
          <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-tight mb-1 group-hover:text-emerald-300 transition-colors">
            {series.name || "Título Indisponível"}
          </h3>
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-300 mb-1.5">
            {series.rating && parseFloat(series.rating) > 0 && (
              <div className="flex items-center">
                <Star size={12} sm:size={14} className="text-yellow-400 mr-1" />
                <span className="font-semibold">{series.rating}</span>
              </div>
            )}
            {series.year && (
              <span className="bg-gray-700/50 px-1.5 sm:px-2 py-0.5 rounded-full text-gray-300 font-medium text-[10px] sm:text-xs">
                {series.year}
              </span>
            )}
          </div>
          {series.category && (
            <p className="text-[9px] sm:text-[10px] text-emerald-200 uppercase tracking-wider font-semibold line-clamp-1 bg-emerald-700/60 px-2 py-1 rounded-full self-start inline-block mb-2.5 max-w-[calc(100%-1rem)] truncate">
              {series.category}
            </p>
          )}
          <div className="flex items-center justify-center text-[10px] xs:text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 p-2 sm:p-2.5 rounded-md transition-all duration-200 transform scale-90 group-hover:scale-100 delay-200">
            <span className="truncate">Ver Detalhes</span>
            <ChevronRight size={14} sm:size={16} className="ml-0.5 sm:ml-1 flex-shrink-0" />
          </div>
        </div>
      </div>
      
      {!isHovered && !displayPlaceholder && (
         <div className="absolute bottom-0 left-0 right-0 p-2.5 pt-4 sm:p-3 sm:pt-5 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
            <h4 className="text-xs sm:text-sm text-center text-white font-semibold truncate">
                {series.name || "Série"}
            </h4>
        </div>
      )}
    </Link>
  );
};

export default SeriesItem;
