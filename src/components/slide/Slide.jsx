import React, { useState, useEffect } from "react";
import { ArrowDown } from 'lucide-react';

const Slide = () => {
  const imageUrls = [
    'https://images7.alphacoders.com/124/thumb-1920-1249146.jpg',
    'https://s1.1zoom.me/b5050/888/Logan_(film)_Wolverine_hero_Hugh_Jackman_x-23_568584_1920x1080.jpg',
    'https://s1.1zoom.me/big3/443/The_Hobbit_The_Battle_of_436136.jpg',
    'https://i.pinimg.com/originals/49/da/7d/49da7d8efab607e46a080cc5356509ea.jpg',
    'https://i.pinimg.com/originals/60/9e/b8/609eb84a96ab833b47bf0c31a8f2b4eb.jpg',
    'https://images.hdqwalls.com/download/the-batman-dc-2021-ck-3840x2160.jpg',
    'https://wallpapers.com/images/hd/fullmetal-alchemist-brotherhood-background-bw70zc19ic49ohxh.jpg',
    'https://images3.alphacoders.com/143/thumb-1920-143517.jpg',
    'https://wallpapercave.com/wp/wp9606151.jpg',
    'https://th.bing.com/th/id/R.ea728d409541bd034be7bf6527b04393?rik=fzvjUeuz0qjRCQ&pid=ImgRaw&r=0',
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg8qBYnOwowAEDc_8kT7mpdIvoq1MEbUV6jPiREZirFoS7MAKiIYNxrC2vh9M3SXzl2IvDHACBNf4y20nDXrOnOI-zq-rbJHVBOXpDXjEcpehH3qndN_9bUTvNoXuXnvzLuabxnbRe4hAek/s1920/20210115202721_1.jpg',
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
