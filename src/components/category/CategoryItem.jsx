import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import MovieItem from '../movies/MovieItem';
import SeriesItem from '../seriesList/SeriesItem';
import AnimeItem from '../animeList/AnimeItem';
import DocumentaryItem from '../documentaryList/DocumentaryItem'; // Assumindo que este componente existe
import Carousel from '../carousel/Carousel';
import Loading from '../loading/Loading'; // Assumindo que você tem este componente
import { LayoutGrid } from 'lucide-react'; // Ícone genérico para categoria vazia

const CategoryItem = ({ category, type, title }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Removido handleItemClick, pois os itens são Links

  useEffect(() => {
    const getItemsByCategory = async () => {
      setLoading(true);
      try {
        const db = getDatabase();
        const itemsRefPath = `${type}s`; // ex: 'movies', 'series', 'animes', 'documentarys'
        const categoryRef = ref(db, itemsRefPath);
        const snapshot = await get(categoryRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const filteredItems = [];

          Object.entries(data).forEach(([id, item]) => {
            if (item.category && item.category.toLowerCase() === category.toLowerCase()) {
              filteredItems.push({ id, ...item });
            }
          });
          
          // Opcional: Ordenar os itens, por exemplo, por nome
          filteredItems.sort((a, b) => a.name?.localeCompare(b.name || ''));
          setItems(filteredItems);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error(`Erro ao buscar itens para categoria ${category} e tipo ${type}:`, error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (category && type) {
      getItemsByCategory();
    } else {
      setLoading(false);
      setItems([]);
    }
  }, [category, type]);

  const getItemWrapperClass = (itemType) => {
    switch (itemType) {
      case 'movie':
      case 'documentary': 
        return "w-40 h-60 sm:w-48 sm:h-72 md:w-[200px] md:h-[300px] lg:w-[230px] lg:h-[345px] flex-shrink-0 px-2 py-1";
      case 'serie':
        return "w-44 h-[275px] sm:w-48 sm:h-[300px] md:w-[190px] md:h-[300px] lg:w-[210px] lg:h-[330px] xl:w-[220px] xl:h-[350px] flex-shrink-0 px-2 py-2";
      case 'anime':
        return "w-44 h-[275px] sm:w-48 sm:h-[300px] md:w-[190px] md:h-[300px] lg:w-[210px] lg:h-[330px] xl:w-[220px] xl:h-[350px] flex-shrink-0 px-2.5 py-2";
      default:
        return "w-40 sm:w-60 flex-shrink-0 px-2 py-1";
    }
  };

  const itemComponents = items.map((item) => {
    const commonProps = { id: item.id };
    let ItemComponent;

    switch (type) {
      case 'movie':
        ItemComponent = <MovieItem movie={item} {...commonProps} />;
        break;
      case 'serie':
        ItemComponent = <SeriesItem series={item} {...commonProps} />;
        break;
      case 'anime':
        ItemComponent = <AnimeItem anime={item} {...commonProps} />;
        break;
      case 'documentary':
        ItemComponent = <DocumentaryItem documentary={item} {...commonProps} />;
        break;
      default:
        return null;
    }
    return (
      <div key={item.id} className={getItemWrapperClass(type)}>
        {ItemComponent}
      </div>
    );
  });

  if (loading) {
    return (
      <div className="flex-grow md:ml-20 py-10 text-center text-gray-400 transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-500 animate-pulse">
            Carregando {title || 'Itens'}...
          </h2>
          <div className="h-72 flex items-center justify-center text-gray-600">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-grow md:ml-20 py-10 text-center transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <LayoutGrid size={56} className="mx-auto text-gray-700 mb-5" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-500">
                Nenhum item encontrado em "{title || category}"
            </h2>
            <p className="text-gray-600">Explore outras categorias ou volte mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow md:ml-20 py-10 text-gray-100 transition-all duration-300 ease-in-out -mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5 sm:mb-8 text-white">
          {title || category}
        </h2>
          <Carousel items={itemComponents} />
      </div>
    </div>
  );
};

export default CategoryItem;
