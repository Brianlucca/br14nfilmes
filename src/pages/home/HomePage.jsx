import React from "react";
import Footer from "../../components/footer/Footer";
import MovieList from "../../components/movies/MovieList";
import Sidebar from "../../components/sidebar/Sidebar";
import RecommendationPreview from "../../components/recommendationPreview/RecommendationPreview";
import MusicList from "../../components/musicList/MusicList";
import AnimeList from "../../components/animeList/AnimeList";
import SeriesList from "../../components/seriesList/SeriesList";
import Slide from "../../components/slide/Slide";
import Faq from "../../components/faq/Faq";

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
          <MusicList />
          <RecommendationPreview />
          <Faq />
        </main>
      </div>
      <Footer />
    </div>
  );};

export default HomePage;
