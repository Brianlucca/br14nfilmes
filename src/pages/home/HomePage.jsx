import React from "react";
import Footer from "../../components/footer/Footer";
import MovieList from "../../components/movies/MovieList";
import Sidebar from "../../components/sidebar/Sidebar";
import RecommendationPreview from "../../components/recommendationPreview/RecommendationPreview";

const HomePage = () => {

  return (
    <div>
      <Sidebar />
      <main>
        <MovieList />
        <RecommendationPreview />
      </main>
      <Footer />
    </div>
  );};

export default HomePage;
