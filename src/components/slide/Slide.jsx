import React, { useState, useEffect } from "react";
import { ArrowDown } from 'lucide-react';

const Slide = () => {
  const imageUrls = [
    'https://images.hdqwalls.com/download/the-batman-dc-2021-ck-3840x2160.jpg',
    'https://images3.alphacoders.com/143/thumb-1920-143517.jpg',
    'https://wallpapercave.com/wp/wp9606151.jpg',
    'https://th.bing.com/th/id/R.ea728d409541bd034be7bf6527b04393?rik=fzvjUeuz0qjRCQ&pid=ImgRaw&r=0',
    'https://www.themoviedb.org/t/p/original/438rfSdrF7PA8dtvS9BlWTw2Ssi.jpg',
    'https://images5.alphacoders.com/111/thumb-1920-1111276.jpg',
    'https://external-preview.redd.it/X1mIR5US4FcO4iGX49Cr1C1h7jqHl2gSbcpj5b1dyI4.jpg?width=1024&auto=webp&s=36ce4f1ad63c57ba7d9d715cb8683eea4184b254',
    'https://wallpapercave.com/wp/SJ8UZV6.jpg',
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
