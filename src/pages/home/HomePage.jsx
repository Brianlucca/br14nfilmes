import React, { useState, useEffect } from "react";
import Footer from "../../components/footer/Footer";
import MovieList from "../../components/movies/MovieList";
import Sidebar from "../../components/sidebar/Sidebar";
import RecommendationPreview from "../../components/recommendationPreview/RecommendationPreview";
import AnimeList from "../../components/animeList/AnimeList";
import SeriesList from "../../components/seriesList/SeriesList";
import Slide from "../../components/slide/Slide";
import Faq from "../../components/faq/Faq";
import DocumentaryList from "../../components/documentaryList/DocumentaryList";
import MovieComediaList from "../../components/category/comediaList/MovieComediaList";
import SerieComediaList from "../../components/category/comediaList/SerieComediaList";
import MovieActionList from "../../components/category/actionList/MovieActionList";
import SerieActionList from "../../components/category/actionList/SerieActionList";
import MovieAdventureList from "../../components/category/adventureList/MovieAdventureList";
import SerieAdventureList from "../../components/category/adventureList/SerieAdventureList";
import MovieCrimeList from "../../components/category/crimeList/MovieCrimeList";
import SerieCrimeList from "../../components/category/crimeList/SerieCrimeList";
import MovieDramaList from "../../components/category/dramaList/MovieDramaList";
import SerieDramaList from "../../components/category/dramaList/SerieDramaList";
import MovieFantasyList from "../../components/category/FantasyList/MovieFantasyList";
import SerieFantasyList from "../../components/category/FantasyList/SerieFantasyList";
import MovieHorrorList from "../../components/category/horrorList/MovieHorrorList";
import SerieHorrorList from "../../components/category/horrorList/SerieHorrorList";
import MovieMysteryList from "../../components/category/MysteryList/MovieMysteryList";
import SerieMysteryList from "../../components/category/MysteryList/SerieMysteryList";
import MovieRomanceList from "../../components/category/romanceList/MovieRomanceList";
import SerieRomanceList from "../../components/category/romanceList/SerieRomanceList";
import MovieScienceFictionList from "../../components/category/scienceFictionList/MovieScienceFictionList";
import SerieScienceFictionList from "../../components/category/scienceFictionList/SerieScienceFictionList";
import MovieSciFiList from "../../components/category/sciFiList/MovieSciFiList";
import SerieSciFiList from "../../components/category/sciFiList/SerieSciFiList";
import MovieSuperHeroList from "../../components/category/superHeroList/MovieSuperHeroList";
import SerieSuperHeroList from "../../components/category/superHeroList/SerieSuperHeroList";
import MovieSuspenseList from "../../components/category/suspenseList/MovieSuspenseList";
import SerieSuspenseList from "../../components/category/suspenseList/SerieSuspenseList";
import MovieTerrorList from "../../components/category/terrorList/MovieTerrorList";
import SerieTerrorList from "../../components/category/terrorList/SerieTerrorList";
import SearchOverlay from "../../components/search/SearchOverlay";
import { Search as SearchIconLucide } from "lucide-react";


const HomePage = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div>
      <div>
        <Sidebar />
        <div className='bg-black'>
          <div>
            <main className="">
              <Slide />
              <MovieList />
              <SeriesList />
              <AnimeList />
              <RecommendationPreview />
              <DocumentaryList />
              <MovieComediaList />
              <SerieComediaList />
              <MovieActionList />
              <SerieActionList />
              <MovieAdventureList />
              <SerieAdventureList />
              <MovieCrimeList />
              <SerieCrimeList />
              <MovieDramaList />
              <SerieDramaList />
              <MovieFantasyList />
              <SerieFantasyList />
              <MovieHorrorList />
              <SerieHorrorList />
              <MovieMysteryList />
              <SerieMysteryList />
              <MovieRomanceList />
              <SerieRomanceList />
              <MovieScienceFictionList />
              <SerieScienceFictionList />
              <MovieSciFiList />
              <SerieSciFiList />
              <MovieSuperHeroList />
              <SerieSuperHeroList />
              <MovieSuspenseList />
              <SerieSuspenseList />
              <MovieTerrorList />
              <SerieTerrorList />
              <Faq />
            </main>
          </div>
        </div>
      </div>
      <Footer />

      <button
        onClick={() => setIsSearchOpen(true)}
        aria-label="Buscar conteúdo"
        title="Buscar conteúdo"
        className="fixed bottom-24 right-6 md:bottom-auto md:top-3 md:right-8 z-40 flex items-center justify-center p-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-full shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-100 md:rounded-lg md:px-4 md:py-3"
      >
        <SearchIconLucide size={20} className="md:mr-2 flex-shrink-0" />
        <span className="hidden md:inline font-semibold text-sm tracking-wide">Buscar conteúdo</span>
      </button>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default HomePage;