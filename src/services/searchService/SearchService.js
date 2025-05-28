import { fetchAnimes } from "../animeService/AnimeService.js";
import { fetchDocumentary } from "../documentaryService/documentaryService.js";
import { fetchMovies } from "../movieService/MovieService.js";
import { fetchSeries } from "../seriesService/SeriesService.js";

const transformFirebaseData = (data, type) => {
  if (!data || typeof data !== "object") return [];
  return Object.entries(data).map(([id, item]) => ({
    id,
    type,
    name: item.name || "Título Indisponível",
    imageUrl: item.imageUrl,
    gif: item.gif,
    rating: item.rating,
    year: item.year,
    category: item.category,
  }));
};

export const searchAllContent = async (query) => {
  if (!query || query.trim() === "" || query.trim().length < 2) {
    return [];
  }

  const lowerCaseQuery = query.toLowerCase();

  try {
    const [moviesData, seriesData, animesData, documentariesData] =
      await Promise.all([
        fetchMovies().catch(() => ({})),
        fetchSeries().catch(() => ({})),
        fetchAnimes().catch(() => ({})),
        fetchDocumentary().catch(() => ({})),
      ]);

    const allMovies = transformFirebaseData(moviesData, "movie");
    const allSeries = transformFirebaseData(seriesData, "series");
    const allAnimes = transformFirebaseData(animesData, "anime");
    const allDocumentaries = transformFirebaseData(
      documentariesData,
      "documentary",
    );

    const combinedContent = [
      ...allMovies,
      ...allSeries,
      ...allAnimes,
      ...allDocumentaries,
    ];

    const filteredResults = combinedContent.filter(
      (item) => item.name && item.name.toLowerCase().includes(lowerCaseQuery),
    );

    return filteredResults;
  } catch (error) {
    throw new Error("Falha ao realizar a busca. Tente novamente.");
  }
};
