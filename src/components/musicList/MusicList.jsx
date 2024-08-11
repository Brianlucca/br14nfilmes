import { useEffect, useState } from 'react';
import { fetchMusic } from '../../services/musicService/MusicService';
import MusicItem from './MusicItem';
import Carousel from '../carousel/Carousel'; 

const MusicList = () => {
  const [music, setMusic] = useState([]);

  useEffect(() => {
    const getMusic = async () => {
      try {
        const musicData = await fetchMusic();
        setMusic(Object.entries(musicData));
      } catch (error) {
      }
    };

    getMusic();
  }, []);

  const musicItems = music.map(([id, track]) => (
    <div key={id} className="w-40 sm:w-60 flex-shrink-0">
      <MusicItem music={track} id={id} />
    </div>
  ));

  return (
    <div className=" sm:ml-16 lg:ml-20 p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Músicas</h1>
      <Carousel items={musicItems} />
    </div>
  );
};

export default MusicList;
