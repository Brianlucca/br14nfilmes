import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AddMovieForm from "../../components/admin/addMovieForm/AddMovieForm";
import AdminCommentsList from "../../components/admin/adminCommentsList/AdminCommentsList";
import RecommendationList from "../../components/admin/recommendationAdmin/RecommendationList";
import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../contexts/authContext/AuthContext";

const AdminPage = () => {
  const { isAdmin } = useContext(AuthContext);

  if (isAdmin === undefined) {
    return <Loading />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div>
    <div className="bg-gray-100 min-h-screen flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col space-y-8 lg:space-y-0 lg:space-x-8 lg:ml-20">
        <div className="flex flex-col sm:flex-row lg:space-x-8 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-1/2">
            <AddMovieForm />
          </div>
          <div className="w-full sm:w-1/2">
            <AdminCommentsList />
          </div>
        </div>
        <div className="w-full">
          <RecommendationList />
        </div>
      </div>
    </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
