import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import MovieItem from '../movies/MovieItem';
import SeriesItem from '../seriesList/SeriesItem';
import AnimeItem from '../animeList/AnimeItem';
import DocumentaryItem from '../documentaryList/DocumentaryItem';
import Carousel from '../carousel/Carousel';

const CategoryItem = ({ category, type, title }) => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getItemsByCategory = async () => {
      try {
        const db = getDatabase();
        const categoryRef = ref(db, `${type}s`);
        const snapshot = await get(categoryRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const filteredItems = [];

          Object.entries(data).forEach(([id, item]) => {
            if (item.category === category) {
              filteredItems.push({ id, ...item });
            }
          });

          setItems(filteredItems);
        } else {
          setItems([]);
        }
      } catch (error) {
      }
    };

    getItemsByCategory();
  }, [category, type]);

  const handleItemClick = (id) => {
    navigate(`/${type}/${id}`);
  };

  const itemComponents = items.map(({ id, ...item }) => (
    <div
      key={id}
      className="w-40 sm:w-60 flex-shrink-0 cursor-pointer"
      onClick={() => handleItemClick(id)}
    >
      {type === 'movie' && <MovieItem movie={item} />}
      {type === 'serie' && <SeriesItem series={item} />}
      {type === 'anime' && <AnimeItem anime={item} />}
      {type === 'documentary' && <DocumentaryItem documentary={item} />}
    </div>
  ));

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="category-list sm:ml-16 lg:ml-20 p-4">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">{title}</h2>
      <Carousel items={itemComponents} />
    </div>
  );
};

export default CategoryItem;