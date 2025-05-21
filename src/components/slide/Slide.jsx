import React, { useState, useEffect, useCallback } from 'react';
import { ArrowDown, ChevronLeft, ChevronRight } // Ícones para navegação
from 'lucide-react';

const slideContent = [
  {
    title: "Descubra Novos Mundos",
    description: "Explore uma vasta coleção de filmes, séries e animes.",
    imageUrl: 'https://images7.alphacoders.com/124/thumb-1920-1249146.jpg',
  },
  {
    title: "Heróis Inesquecíveis",
    description: "Acompanhe as jornadas épicas dos seus personagens favoritos.",
    imageUrl: 'https://s1.1zoom.me/b5050/888/Logan_(film)_Wolverine_hero_Hugh_Jackman_x-23_568584_1920x1080.jpg',
  },
  {
    title: "Aventuras Épicas",
    description: "Batalhas grandiosas e terras místicas esperam por você.",
    imageUrl: 'https://s1.1zoom.me/big3/443/The_Hobbit_The_Battle_of_436136.jpg',
  },
  {
    title: "O Cavaleiro das Trevas",
    description: "A justiça tem um novo nome em Gotham.",
    imageUrl: 'https://images.hdqwalls.com/download/the-batman-dc-2021-ck-3840x2160.jpg',
  },
  {
    title: "Alquimia e Irmandade",
    description: "Dois irmãos buscam a verdade em um mundo de trocas equivalentes.",
    imageUrl: 'https://wallpapers.com/images/hd/fullmetal-alchemist-brotherhood-background-bw70zc19ic49ohxh.jpg',
  },
  {
    title: "A Ascensão de um Herói",
    description: "Com grandes poderes, vêm grandes responsabilidades.",
    imageUrl: 'https://images3.alphacoders.com/143/thumb-1920-143517.jpg',
  },
   {
    title: "Mob Psycho 100",
    description: "Quando suas emoções chegam a 100%, algo terrível acontece.",
    imageUrl: 'https://th.bing.com/th/id/R.ea728d409541bd034be7bf6527b04393?rik=fzvjUeuz0qjRCQ&pid=ImgRaw&r=0',
  },
  {
    title: "Crimes e muita ação",
    description: "Uma van, dois caras e muita coisa errada.",
    imageUrl: 'https://images5.alphacoders.com/111/thumb-1920-1111276.jpg',
  },
];


const Slide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slideContent.length - 1 : prevIndex - 1
    );
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % slideContent.length
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNext, 7000); // Aumentei o tempo para 7 segundos
    return () => clearInterval(timer);
  }, [goToNext]);

  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight * 0.85, // Rola quase uma tela inteira
      behavior: 'smooth'
    });
  };

  const currentSlide = slideContent[currentIndex];

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-screen mx-auto overflow-hidden bg-black">
      <div className="relative w-full h-full">
        {slideContent.map((slide, index) => (
          <div
            key={slide.imageUrl}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title || `Slide ${index}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:w-2/3"></div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-20 flex flex-col justify-end items-center text-center p-6 pb-16 sm:pb-20 md:pb-24 text-white">
        {slideContent.map((slide, index) => (
           <div
            key={`text-${slide.imageUrl}`}
            className={`transition-all duration-700 ease-out transform w-full max-w-3xl
                        ${index === currentIndex 
                            ? 'opacity-100 translate-y-0 delay-300' 
                            : 'opacity-0 translate-y-10 pointer-events-none'
                        }`}
            style={{ position: index === currentIndex ? 'relative' : 'absolute' }} // Garante que só o texto ativo ocupe espaço
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 tracking-tight shadow-text">
              {slide.title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-xl mx-auto shadow-text line-clamp-2 sm:line-clamp-3">
              {slide.description}
            </p>
            {/* <Link 
              to={slide.ctaLink || "/"}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 text-sm sm:text-base"
            >
              {slide.ctaText || "Ver Mais"}
            </Link> */}
          </div>
        ))}
      </div>

      <button
        aria-label="Slide Anterior"
        onClick={goToPrevious}
        className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 z-30 p-2 sm:p-3 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black"
      >
        <ChevronLeft size={24} sm:size={30} />
      </button>
      <button
        aria-label="Próximo Slide"
        onClick={goToNext}
        className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 z-30 p-2 sm:p-3 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black"
      >
        <ChevronRight size={24} sm:size={30} />
      </button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slideContent.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir para o slide ${index + 1}`}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ease-in-out
                        ${currentIndex === index ? 'bg-sky-500 scale-125' : 'bg-gray-400/70 hover:bg-gray-200/90'}`}
          />
        ))}
      </div>

      <style jsx global>{`
        .shadow-text {
          text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Slide;
