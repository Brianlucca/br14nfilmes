import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/authContext/AuthContext";
import Login from "../components/auth/Login";
import AdminPage from "../pages/admin/AdminPage";
import HomePage from "../pages/home/HomePage";
import MovieDetailsPage from "../pages/movieDetails/MovieDetailsPage";
import SeriesDetailsPage from "../pages/seriesDetails/SeriesDetailsPage";
import AnimeDetailsPage from "../pages/animeDetails/AnimeDetailsPage";
import AdminRoute from "./AdminRoute";
import Loading from "../components/loading/Loading"; 
import Recommendations from "../pages/recommendation/Recommendation";
import UpdateProfile from "../pages/updateProfile/UpdateProfile";
import CreateSession from "../pages/createSession/CreateSession";
import JoinSession from "../pages/joinSessionPage/JoinSession";
import WatchSession from "../pages/watchSession/WatchSession";
import PageNotFound from "../pages/pageNotFound/PageNotFound";
import ScrollToTop from "../components/scrollToTop/ScrollToTop";
import FavoritesPage from "../pages/favoritesPage/FavoritesPage";
import DocumentaryDetailsPage from "../pages/DocumentaryDetails/DocumentaryDetailsPage";
import Register from "../components/auth/Register";
import WarningModal from "../components/warnings/WarningsModal";
import VerifyEmail from "../components/auth/VerifyEmail";
import ResetPassword from "../components/auth/ResetPassword";

function RenderRoutes() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("undefined")) {
      window.location.href = "/";
    }
  }, [location]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
        <ScrollToTop />
        {user && <WarningModal />}
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={user ? <Navigate to="/login" /> : <VerifyEmail />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/movie/:id" element={user ? <MovieDetailsPage /> : <Navigate to="/login" />} />
          <Route path="/documentary/:id" element={user ? <DocumentaryDetailsPage /> : <Navigate to="/login" />} />
          <Route path="/serie/:id" element={user ? <SeriesDetailsPage /> : <Navigate to="/login" />} />
          <Route path="/anime/:id" element={user ? <AnimeDetailsPage /> : <Navigate to="/login" />} />
          <Route path="/recommendations" element={user ? <Recommendations /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <UpdateProfile /> : <Navigate to="/login" />} />
          <Route path="/create-session/:id" element={user ? <CreateSession /> : <Navigate to="/login" />} />
          <Route path="/Join-session" element={user ? <JoinSession /> : <Navigate to="/login" />} />
          <Route path="/watchsession/:sessionCode" element={user ? <WatchSession /> : <Navigate to="/login" />} />
          <Route path="/favorites" element={user ? <FavoritesPage /> : <Navigate to="/login" />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
    </>
  );
}

export default RenderRoutes;