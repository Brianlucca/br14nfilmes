import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "../contexts/authContext/AuthContext";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import AdminPage from "../pages/admin/AdminPage";
import HomePage from "../pages/home/HomePage";
import MovieDetailsPage from "../pages/movieDetails/MovieDetailsPage";
import AdminRoute from "./AdminRoute";
import Loading from "../components/loading/Loading"; 
import Recommendations from "../pages/recommendation/Recommendation";
import UpdateProfile from "../pages/updateProfile/UpdateProfile";

function RenderRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/movie/:id" element={user ? <MovieDetailsPage /> : <Navigate to="/login" />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/profile" element={user ? <UpdateProfile /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RenderRoutes;
