import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AddMovieForm from "../../components/admin/addMovieForm/AddMovieForm";
import AdminCommentsList from "../../components/admin/adminCommentsList/AdminCommentsList";
import RecommendationList from "../../components/admin/recommendationAdmin/RecommendationList";
import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import AdminFaqList from "../../components/admin/adminFaqList/AdminFaqList";

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
      <Sidebar />
      <div className="flex">
        <div className="bg-black min-h-screen w-full flex flex-col lg:flex-row">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:ml-20">
            
            <div className="p-6 rounded-lg shadow-lg">
              <AddMovieForm />
            </div>
            
            <div className="p-6 rounded-lg shadow-lg">
              <AdminCommentsList />
            </div>
            
            <div className="p-6 rounded-lg shadow-lg lg:col-span-2">
              <AdminFaqList />
            </div>
            
            <div className="p-6 rounded-lg shadow-lg lg:col-span-2">
              <RecommendationList />
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
