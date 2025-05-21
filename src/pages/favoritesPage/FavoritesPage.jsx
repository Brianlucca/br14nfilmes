import { get, getDatabase, ref, remove } from "firebase/database";
import { Eye, Film, HelpCircle, Tv, XCircle, Youtube } from "lucide-react"; // Added icons
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyMessage from "../../components/emptyMessage/EmptyMessage";
import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../contexts/authContext/AuthContext";

const FavoritesPage = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredFavoriteId, setHoveredFavoriteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const favoritesRef = ref(db, `users/${user.uid}/favorites`);

      const fetchFavorites = async () => {
        setLoading(true);
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
                  category: category.toLowerCase(), // Ensure category is lowercase
                  gif: favoritesData[category][itemId].gif || null,
                });
              });
            });

            // Sort favorites, e.g., by title or a timestamp if available
            formattedFavorites.sort((a, b) => a.title.localeCompare(b.title));
            setFavorites(formattedFavorites);
          } else {
            setFavorites([]);
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
          setFavorites([]);
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    } else {
      setLoading(false);
      setFavorites([]); // Clear favorites if no user
    }
  }, [user]);

  const handleRemoveFavorite = async (e, favorite) => {
    e.stopPropagation();
    if (!user) return;

    const db = getDatabase();
    const favoriteRef = ref(db, `users/${user.uid}/favorites/${favorite.category}/${favorite.id}`);

    try {
      await remove(favoriteRef);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((item) => !(item.id === favorite.id && item.category === favorite.category))
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleNavigateToDetails = (favorite) => {
    switch (favorite.category) {
      case 'movie':
        navigate(`/movie/${favorite.id}`);
        break;
      case 'serie':
        navigate(`/serie/${favorite.id}`);
        break;
      case 'anime':
        navigate(`/anime/${favorite.id}`);
        break;
      case 'documentary': // Assuming you might have documentaries
        navigate(`/documentary/${favorite.id}`);
        break;
      default:
        console.warn("Unknown category for navigation:", favorite.category);
        break;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'movie':
        return <Film size={18} className="text-sky-400" />;
      case 'serie':
        return <Tv size={18} className="text-emerald-400" />;
      case 'anime':
        return <Youtube size={18} className="text-red-400" />; // Or a more specific anime icon
      case 'documentary':
        return <Info size={18} className="text-amber-400" />; // Example for documentary
      default:
        return <HelpCircle size={18} className="text-gray-400" />;
    }
  };


  if (loading) {
    return (
      <div className="flex h-screen bg-black">
        <Sidebar />
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Sidebar />
      <div className="flex-grow md:ml-20 transition-all duration-300 ease-in-out text-gray-300">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 md:pt-12">
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Seus Favoritos
            </h1>
            <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
              Aqui estão todos os filmes, séries e animes que você marcou como favoritos.
            </p>
          </div>

          {favorites.length === 0 ? (
            <EmptyMessage message="Você ainda não adicionou nenhum favorito." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {favorites.map((favorite) => (
                <div
                  key={`${favorite.category}-${favorite.id}`}
                  className="group relative bg-[#1c1c1c] border border-gray-800 shadow-xl rounded-lg overflow-hidden flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-sky-500/30 hover:border-sky-700 transform hover:-translate-y-1"
                  onMouseEnter={() => setHoveredFavoriteId(favorite.id)}
                  onMouseLeave={() => setHoveredFavoriteId(null)}
                  onClick={() => handleNavigateToDetails(favorite)}
                >
                  <div className="relative w-full aspect-[2/3] overflow-hidden cursor-pointer">
                    {hoveredFavoriteId === favorite.id && favorite.gif ? (
                      <img
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-100"
                        src={favorite.gif}
                        alt={`GIF animado de ${favorite.title}`}
                      />
                    ) : (
                      <img
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${hoveredFavoriteId === favorite.id && favorite.gif ? 'opacity-0' : 'opacity-100'}`}
                        src={favorite.imageUrl}
                        alt={favorite.title}
                      />
                    )}
                    {/* Overlay para o botão de ver detalhes */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Eye size={48} className="text-white opacity-80" />
                    </div>
                  </div>

                  <div className="flex-grow p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                          {getCategoryIcon(favorite.category)}
                          {favorite.category}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold text-white line-clamp-2 mb-1.5 group-hover:text-sky-400 transition-colors">
                        {favorite.title}
                      </h2>
                      <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed">
                        {favorite.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-700/50 mt-auto">
                    <button
                      onClick={(e) => handleRemoveFavorite(e, favorite)}
                      className="w-full py-2 px-3 bg-red-700/80 text-white text-xs font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center gap-1.5"
                      aria-label={`Remover ${favorite.title} dos favoritos`}
                    >
                      <XCircle size={16} />
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default FavoritesPage;
