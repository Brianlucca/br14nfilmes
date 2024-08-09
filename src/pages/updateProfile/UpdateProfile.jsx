import { useContext, useState } from "react";
import { ref, update } from "firebase/database";
import { database } from "../../services/firebaseConfig/FirebaseConfig";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/sidebar/Sidebar";

const UpdateProfile = () => {
  const { user } = useContext(AuthContext);
  const [nickname, setNickname] = useState("");

  const handleUpdateProfile = async () => {
    if (!user) {
      console.error("Usuário não autenticado");
      return <Navigate to='/cadastro' />;
    } 

    const roleId = user.uid;
    const userRef = ref(database, `users/${user.uid}/updateNick/${roleId}`);
    try {
      await update(userRef, { nickname });
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil!");
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg border border-gray-200 mt-10 sm:mt-12 md:mt-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Atualizar Perfil</h2>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Digite seu nickname"
          className="w-full p-3 sm:p-4 bg-gray-100 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mb-4"
        />
        <button
          onClick={handleUpdateProfile}
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition duration-300"
        >
          Salvar
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default UpdateProfile;
