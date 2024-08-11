import { useEffect, useState } from 'react';
import { fetchSeries } from '../../services/seriesService/SeriesService';
import SeriesItem from './SeriesItem';
import Carousel from '../carousel/Carousel'; 

const SeriesList = () => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const getSeries = async () => {
      try {
        const seriesData = await fetchSeries();
        setSeries(Object.entries(seriesData));
      } catch (error) {
      }
    };

    getSeries();
  }, []);

  const seriesItems = series.map(([id, serie]) => (
    <div key={id} className="w-40 sm:w-60 flex-shrink-0">
      <SeriesItem series={serie} id={id} />
    </div>
  ));

  return (
    <div className=" sm:ml-16 lg:ml-20 p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Séries</h1>
      <Carousel items={seriesItems} />
    </div>
  );
};

export default SeriesList;
