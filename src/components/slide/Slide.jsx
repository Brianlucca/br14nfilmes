import React, { useState, useEffect } from "react";
import { ArrowDown } from 'lucide-react';

const Slide = () => {
  const imageUrls = [
    'https://i0.wp.com/assets.b9.com.br/wp-content/uploads/2018/04/av.jpg?fit=2200%2C1238&ssl=1',
    'https://i.ytimg.com/vi/WozGVu01YfU/maxresdefault.jpg',
    'https://lavrapalavra.com/wp-content/uploads/2021/01/segunda-temporada-de-dark-destaque.jpg',
    'https://www.folhadelondrina.com.br/img/Facebook/3260000/Deadpool--Wolverine-a-Marvel-contra-ataca-nos-cine0326311000202407251909.jpg?xid=6103504',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [imageUrls.length]);

  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight * 0.9,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-full max-w-full mx-auto overflow-hidden">
      <div className="relative flex">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {imageUrls.map((url, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <img
                src={url}
                alt={`Slide ${index}`}
                className="w-full h-56 sm:h-72 md:h-96 lg:h-[600px] object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="absolute bottom-4 right-1/2 transform translate-x-1/2 hidden lg:block animate-bounce"
        onClick={handleScrollDown}
      >
        <ArrowDown className="w-8 h-8 text-white" />
      </button>
    </div>
  );
};

export default Slide;
