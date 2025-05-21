import { useEffect, useState } from 'react';
import { fetchSeries } from '../../services/seriesService/SeriesService';
import SeriesItem from './SeriesItem';
import Carousel from '../carousel/Carousel';
import Loading from '../loading/Loading';
import { Tv } from 'lucide-react';

const SeriesList = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSeries = async () => {
      setLoading(true);
      setError(null);
      try {
        const seriesData = await fetchSeries();
        if (seriesData && typeof seriesData === 'object') {
          const sortedSeries = Object.entries(seriesData).sort(([, seriesA], [, seriesB]) => {
            if (seriesA.name && seriesB.name) {
              return seriesA.name.localeCompare(seriesB.name);
            }
            if (seriesA.name) return -1;
            if (seriesB.name) return 1;
            return 0;
          });
          setSeries(sortedSeries);
        } else {
          setSeries([]);
        }
      } catch (err) {
        setError("Não foi possível carregar as séries no momento. Tente novamente mais tarde.");
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    getSeries();
  }, []);

  const seriesItems = series.map(([id, serie]) => (
    <div 
      key={id} 
      className="w-44 h-[275px] sm:w-48 sm:h-[300px] md:w-[190px] md:h-[300px] lg:w-[210px] lg:h-[330px] xl:w-[220px] xl:h-[350px] flex-shrink-0 px-2 py-2"
    >
      <SeriesItem series={serie} id={id} />
    </div>
  ));

  if (loading) {
    return (
      <div className="flex-grow md:ml-20 py-10 text-center text-gray-400 transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-500 animate-pulse">
                Carregando Séries...
            </h2>
            <div className="h-[350px] flex items-center justify-center text-gray-600">
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

  if (series.length === 0 && !loading) {
    return (
      <div className="flex-grow md:ml-20 py-10 text-center transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tv size={56} className="mx-auto text-gray-700 mb-5" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-500">
                Nenhuma Série Encontrada
            </h2>
            <p className="text-gray-600">Parece que não há séries disponíveis no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow md:ml-20 py-10 text-gray-100 transition-all duration-300 ease-in-out -mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5 sm:mb-8 text-white">
          Séries Populares
        </h2>
        {seriesItems.length > 0 ? (
            <Carousel items={seriesItems} />
        ) : (
            !loading && <p className="text-center text-gray-500">Nenhuma série para exibir no carrossel.</p>
        )}
      </div>
    </div>
  );
};

export default SeriesList;
