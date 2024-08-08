import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AddMovieForm from "../../components/admin/addMovieForm/AddMovieForm"; 
import { AuthContext } from "../../contexts/authContext/AuthContext";
import Sidebar from "../../components/sidebar/Sidebar";
import Footer from "../../components/footer/Footer";
import RecommendationList from "../../components/admin/recommendationAdmin/RecommendationList";
import Loading from "../../components/loading/Loading";

const AdminPage = () => {
  const { isAdmin } = useContext(AuthContext);

  if (isAdmin === undefined) {
    return <Loading />
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-gray-100">
      <Sidebar />
      <AddMovieForm />
      <RecommendationList />
      <Footer />
    </div>
  );
};

export default AdminPage;
