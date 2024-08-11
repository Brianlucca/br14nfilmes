import React from "react";
import Footer from "../../components/footer/Footer";
import MovieList from "../../components/movies/MovieList";
import Sidebar from "../../components/sidebar/Sidebar";
import RecommendationPreview from "../../components/recommendationPreview/RecommendationPreview";
import MusicList from "../../components/musicList/MusicList";
import AnimeList from "../../components/animeList/AnimeList";
import SeriesList from "../../components/seriesList/SeriesList";

const HomePage = () => {

  return (
    <div className="bg-gray-300">
      <Sidebar />
      <main>
        <MovieList />
        <SeriesList />
        <AnimeList />
        <MusicList />
        <RecommendationPreview />
      </main>
      <Footer />
    </div>
  );};

export default HomePage;
