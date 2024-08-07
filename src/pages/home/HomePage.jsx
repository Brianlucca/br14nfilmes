import React, { useContext } from "react";
import MovieList from "../../components/movies/MovieList";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  // if (!user) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <div>
      <h1>Lista de Filmes</h1>
      <MovieList />
    </div>
  );};

export default HomePage;
