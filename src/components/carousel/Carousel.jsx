import React, { useRef, useState, useEffect } from 'react';

const Carousel = ({ items }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      const isScrollable = scrollWidth > clientWidth;
      setCanScrollLeft(isScrollable && scrollLeft > 0);
      setCanScrollRight(isScrollable && scrollLeft < scrollWidth - clientWidth);
    }
  };

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

  useEffect(() => {
    updateScrollButtons();

    const handleScroll = () => {
      updateScrollButtons();
    };

    const currentScrollRef = scrollRef.current;

    if (currentScrollRef) {
      currentScrollRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [items]);

  return (
    <div className="relative overflow-hidden">
      {canScrollLeft && (
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white hover:text-black shadow-lg hover:bg-gray-100 text-2xl p-2 w-12 h-12 rounded-full flex items-center justify-center z-10 transition duration-300"
          onClick={scrollLeft}
        >
          &#10094;
        </button>
      )}
      <div
        ref={scrollRef}
        className="carousel flex overflow-x-auto"
      >
        {items}
      </div>
      {canScrollRight && (
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white hover:text-black shadow-lg hover:bg-gray-100 text-2xl p-2 w-12 h-12 rounded-full flex items-center justify-center z-10 transition duration-300"
          onClick={scrollRight}
        >
          &#10095;
        </button>
      )}
    </div>
  );
};

export default Carousel;
