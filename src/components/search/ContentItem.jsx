import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Film, Tv, BookOpen, PlayCircle, ChevronRight } from "lucide-react";

const ContentItem = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageToShow = isHovered && item.gif ? item.gif : item.imageUrl;
  const displayPlaceholder = imageError || !imageToShow;

  let placeholderIcon = <Film size={56} className="text-gray-600" />;
  let typeColorClasses = "hover:shadow-sky-500/30 hover:border-sky-600/60 focus:shadow-sky-500/40";
  let titleHoverColor = "group-hover:text-sky-300";
  let buttonColor = "bg-sky-600 hover:bg-sky-700";
  let categoryColor = "text-sky-200 bg-sky-700/60";
  let itemTypeDisplay = "Filme";

  switch (item.type) {
    case 'series':
      placeholderIcon = <Tv size={56} className="text-gray-600" />;
      typeColorClasses = "hover:shadow-emerald-500/30 hover:border-emerald-600/60 focus:shadow-emerald-500/40";
      titleHoverColor = "group-hover:text-emerald-300";
      buttonColor = "bg-emerald-600 hover:bg-emerald-700";
      categoryColor = "text-emerald-200 bg-emerald-700/60";
      itemTypeDisplay = "Série";
      break;
    case 'anime':
      placeholderIcon = <PlayCircle size={56} className="text-gray-600" />;
      typeColorClasses = "hover:shadow-purple-500/30 hover:border-purple-600/60 focus:shadow-purple-500/40";
      titleHoverColor = "group-hover:text-purple-300";
      buttonColor = "bg-purple-600 hover:bg-purple-700";
      categoryColor = "text-purple-200 bg-purple-700/60";
      itemTypeDisplay = "Anime";
      break;
    case 'documentary':
      placeholderIcon = <BookOpen size={56} className="text-gray-600" />;
      typeColorClasses = "hover:shadow-yellow-500/30 hover:border-yellow-600/60 focus:shadow-yellow-500/40";
      titleHoverColor = "group-hover:text-yellow-300";
      buttonColor = "bg-yellow-600 hover:bg-yellow-700";
      categoryColor = "text-yellow-200 bg-yellow-700/60";
      itemTypeDisplay = "Documentário";
      break;
    default:
      itemTypeDisplay = "Filme";
      typeColorClasses = "hover:shadow-amber-500/30 hover:border-amber-600/60 focus:shadow-amber-500/40";
      titleHoverColor = "group-hover:text-amber-300";
      buttonColor = "bg-amber-600 hover:bg-amber-700";
      categoryColor = "text-amber-200 bg-amber-700/60";
      break;
  }

  return (
    <Link
      to={`/${item.type}/${item.id}`}
      aria-label={`Ver detalhes de ${item.name || "Conteúdo"}`}
      className={`relative block w-full h-full bg-[#101014] rounded-md overflow-hidden shadow-lg group transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl border border-gray-700/50 focus:outline-none ${typeColorClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayPlaceholder ? (
        <div className="w-full h-full flex items-center justify-center bg-[#1c1c22] rounded-md">
          {placeholderIcon}
        </div>
      ) : (
        <img
          src={imageToShow}
          alt={`Poster de ${item.name || itemTypeDisplay}`}
          className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all duration-300 ease-in-out group-hover:bg-black/40"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transition-all duration-500 ease-out transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
        <div className="bg-black/75 backdrop-blur-md p-3 sm:p-4 rounded-t-md transform transition-all duration-500 ease-out delay-100">
          <h3 className={`text-sm sm:text-base font-bold text-white line-clamp-2 leading-tight mb-1 ${titleHoverColor} transition-colors`}>
            {item.name || "Título Indisponível"}
          </h3>
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-300 mb-1.5">
            {item.rating && parseFloat(item.rating) > 0 && (
              <div className="flex items-center">
                <Star size={12} className="text-yellow-400 mr-1" />
                <span className="font-semibold">{item.rating}</span>
              </div>
            )}
            {item.year && (
              <span className="bg-gray-700/50 px-1.5 sm:px-2 py-0.5 rounded-full text-gray-300 font-medium text-[10px] sm:text-xs">
                {item.year}
              </span>
            )}
          </div>
          {item.category && (
            <p className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold line-clamp-1 px-2 py-1 rounded-full self-start inline-block mb-2.5 max-w-[calc(100%-1rem)] truncate ${categoryColor}`}>
              {item.category}
            </p>
          )}
          <div className={`flex items-center justify-center text-[10px] xs:text-xs sm:text-sm font-semibold text-white p-2 sm:p-2.5 rounded-md transition-all duration-200 transform scale-90 group-hover:scale-100 delay-200 ${buttonColor}`}>
            <span className="truncate">Ver Detalhes</span>
            <ChevronRight size={14} className="ml-0.5 sm:ml-1 flex-shrink-0" />
          </div>
        </div>
      </div>
      
      {!isHovered && !displayPlaceholder && (
         <div className="absolute bottom-0 left-0 right-0 p-2.5 pt-4 sm:p-3 sm:pt-5 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
           <h4 className="text-xs sm:text-sm text-center text-white font-semibold truncate">
               {item.name || itemTypeDisplay}
           </h4>
       </div>
     )}
    </Link>
  );
};

export default ContentItem;