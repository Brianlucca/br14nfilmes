import React from "react";
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

const HomePage = () => {

  return (
    <div>
      <Sidebar />
      <div className="bg-black">
        <main>
          <Slide />
          <MovieList />
          <SeriesList />
          <AnimeList />
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
          <RecommendationPreview />
          <Faq />
        </main>
      </div>
      <Footer />
    </div>
  );};

export default HomePage;
