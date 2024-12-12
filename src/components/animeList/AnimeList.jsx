import { useEffect, useState } from 'react';
import { fetchAnimes } from '../../services/animeService/AnimeService';
import AnimeItem from './AnimeItem';
import Carousel from '../carousel/Carousel'; 

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);

  useEffect(() => {
    const getAnimes = async () => {
      try {
        const animesData = await fetchAnimes();
        setAnimes(Object.entries(animesData));
      } catch (error) {
      }
    };

    getAnimes();
  }, []);

  const animeItems = animes.map(([id, anime]) => (
    <div key={id} className="w-40 sm:w-60 flex-shrink-0">
      <AnimeItem anime={anime} id={id} />
    </div>
  ));

  return (
    <div className=" sm:ml-16 lg:ml-20 p-2 sm:p-4">
      {animes.length > 0 && (
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-700">Animes</h1>
      )}
      <Carousel items={animeItems} />
    </div>
  );
};

export default AnimeList;
