import React, { useRef } from 'react';

const Carousel = ({ items }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-transparent text-gray-300 text-3xl p-2 w-10 rounded-md z-10 transition-transform duration-300 ease-in-out hover:bg-gray-500 hover:text-white"
        onClick={scrollLeft}
      >
        &#10094;
      </button>
      <div
        ref={scrollRef}
        className="carousel flex overflow-x-auto"
      >
        {items}
      </div>
      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-transparent text-gray-300 text-3xl p-2 w-10 rounded-md z-10 transition-transform duration-300 ease-in-out hover:bg-gray-500 hover:text-white"
        onClick={scrollRight}
      >
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
