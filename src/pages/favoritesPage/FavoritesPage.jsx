import clsx from "clsx";
import { get, getDatabase, ref, remove } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import EmptyMessage from "../../components/emptyMessage/EmptyMessage";
import Loading from "../../components/loading/Loading";

const FavoritesPage = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredFavorite, setHoveredFavorite] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const favoritesRef = ref(db, `users/${user.uid}/favorites`);
      
      const fetchFavorites = async () => {
        try {
          const snapshot = await get(favoritesRef);
          if (snapshot.exists()) {
            const favoritesData = snapshot.val();
            const formattedFavorites = [];

            Object.keys(favoritesData).forEach((category) => {
              Object.keys(favoritesData[category]).forEach((itemId) => {
                formattedFavorites.push({
                  id: itemId,
                  ...favoritesData[category][itemId],
                  category: category,
                  gif: favoritesData[category][itemId].gif || null,
                });
              });
            });

            setFavorites(formattedFavorites);
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }
  }, [user]);

  const handleRemoveFavorite = async (favorite) => {
    const db = getDatabase();
    const favoriteRef = ref(db, `users/${user.uid}/favorites/${favorite.category}/${favorite.id}`);
    
    try {
      await remove(favoriteRef);
      setFavorites(favorites.filter((item) => item.id !== favorite.id));
    } catch (error) {
    }
  };

  const handleNavigateToDetails = (favorite) => {
    switch (favorite.category) {
      case 'movie':
        navigate(`/movie/${favorite.id}`);
        break;
      case 'music':
        navigate(`/music/${favorite.id}`);
        break;
      case 'serie':
        navigate(`/serie/${favorite.id}`);
        break;
      case 'anime':
        navigate(`/anime/${favorite.id}`);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (favorites.length === 0) {
    return <EmptyMessage />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <div className="flex-grow flex flex-col items-center py-8">
        <div className="w-full max-w-6xl px-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-center mb-8 text-gray-400">Seus Favoritos</h1>
          <div className="favorites-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className={clsx(
                  "favorite-item bg-[#1a1a1a] shadow-lg rounded-lg overflow-hidden flex flex-col h-full transition-transform transform hover:scale-105 cursor-pointer",
                  hoveredFavorite === favorite.id && "bg-gif"
                )}
                onMouseEnter={() => setHoveredFavorite(favorite.id)}
                onMouseLeave={() => setHoveredFavorite(null)}
                onClick={() => handleNavigateToDetails(favorite)}
              >
                {hoveredFavorite === favorite.id && favorite.gif ? (
                  <div
                    className="w-full h-48 bg-cover bg-center transition-all duration-300"
                    style={{ backgroundImage: `url(${favorite.gif})` }}
                  ></div>
                ) : (
                  <img className="w-full h-48 object-cover transition-all duration-300" src={favorite.imageUrl} alt={favorite.title} />
                )}
                <div className="flex-grow p-4">
                  <h2 className="text-xl font-semibold mb-2 text-white line-clamp-2 text-center">{favorite.title}</h2>
                  <p className="text-gray-400 text-sm line-clamp-3">{favorite.description}</p>
                </div>
                <div className="p-4 mt-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(favorite);
                    }}
                    className="w-full py-2 px-4 bg-[#605f5f] text-white font-semibold rounded-lg hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f] transition-all"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
