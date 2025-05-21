import { useEffect, useState } from 'react';
import { fetchAnimes } from '../../services/animeService/AnimeService';
import AnimeItem from './AnimeItem';
import Carousel from '../carousel/Carousel';
import Loading from '../loading/Loading';
import { Tv2 } from 'lucide-react';

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAnimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const animesData = await fetchAnimes();
        if (animesData && typeof animesData === 'object') {
          const sortedAnimes = Object.entries(animesData).sort(([, animeA], [, animeB]) => {
            if (animeA.name && animeB.name) {
              return animeA.name.localeCompare(animeB.name);
            }
            if (animeA.name) return -1;
            if (animeB.name) return 1;
            return 0;
          });
          setAnimes(sortedAnimes);
        } else {
          setAnimes([]);
        }
      } catch (err) {
        setError("Não foi possível carregar os animes no momento. Tente novamente mais tarde.");
        setAnimes([]);
      } finally {
        setLoading(false);
      }
    };

    getAnimes();
  }, []);

  const animeItems = animes.map(([id, anime]) => (
    <div 
      key={id} 
      className="w-48 h-[320px] sm:w-56 sm:h-[373px] md:w-[200px] md:h-[333px] lg:w-[225px] lg:h-[375px] xl:w-[240px] xl:h-[400px] flex-shrink-0 px-2.5 py-2"
    >
      <AnimeItem anime={anime} id={id} />
    </div>
  ));

  if (loading) {
    return (
      <div className="flex-grow md:ml-20 py-10 text-center text-gray-400 transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-500 animate-pulse">
                Carregando Animes...
            </h2>
            <div className="h-[400px] flex items-center justify-center text-gray-600">
                <Loading />
            </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex-grow md:ml-20 py-10 text-center transition-all duration-300 ease-in-out">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4 text-red-500">
                Oops! Algo deu errado.
            </h2>
            <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (animes.length === 0 && !loading) {
    return (
      <div className="flex-grow md:ml-20 py-10 text-center transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tv2 size={56} className="mx-auto text-gray-700 mb-5" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-500">
                Nenhum Anime Encontrado
            </h2>
            <p className="text-gray-600">Parece que não há animes disponíveis no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow md:ml-20 py-10 text-gray-100 transition-all duration-300 ease-in-out -mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5 sm:mb-8 text-white">
          Animes em Destaque
        </h2>
        {animeItems.length > 0 ? (
            <Carousel items={animeItems} />
        ) : (
            !loading && <p className="text-center text-gray-500">Nenhum anime para exibir no carrossel.</p>
        )}
      </div>
    </div>
  );
};

export default AnimeList;
