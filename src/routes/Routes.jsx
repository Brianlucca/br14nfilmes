import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AdminPage from "../pages/admin/AdminPage";
import HomePage from "../pages/home/HomePage";
import MovieDetailsPage from "../pages/movieDetails/MovieDetailsPage";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext/AuthContext";

function RenderRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/cadastro" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RenderRoutes;
