import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AddMovieForm from "../../components/admin/AddMovieForm";
import { AuthContext } from "../../contexts/authContext/AuthContext";

const AdminPage = () => {
  const { isAdmin } = useContext(AuthContext);

  if (isAdmin === undefined) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <AddMovieForm />
    </div>
  );
};

export default AdminPage;
