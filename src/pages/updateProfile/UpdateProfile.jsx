import { ref, update, get } from "firebase/database";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { database } from "../../services/firebaseConfig/FirebaseConfig";

const UpdateProfile = () => {
  const { user } = useContext(AuthContext);
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const checkNicknameExists = async (newNickname) => {
    const usersRef = ref(database, "users");
    try {
      const snapshot = await get(usersRef);
      const users = snapshot.val();

      for (let key in users) {
        if (users[key]?.updateNick?.[key]?.nickname === newNickname && key !== user.uid) {
          return true;
        }
      }

      return false;
    } catch (error) {
      toast.error("Erro ao verificar o nickname!");
      return false;
    }
  };

  const checkNicknameChangeLimit = async () => {
    const userRef = ref(database, `users/${user.uid}`);
    try {
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (userData.nicknameChangeCount === undefined) {
        await update(userRef, { nicknameChangeCount: 0 });
      }

      return userData.nicknameChangeCount < 3;
    } catch (error) {
      toast.error("Erro ao verificar o limite de trocas de nickname!");
      return false;
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) {
      return navigate('/login');
    }

    if (!nickname.trim()) {
      toast.error("O campo nickname não pode estar vazio!");
      return;
    }

    const nicknameExists = await checkNicknameExists(nickname);

    if (nicknameExists) {
      toast.error("Nickname já em uso! Escolha outro.");
      return;
    }

    const canChangeNickname = await checkNicknameChangeLimit();

    if (!canChangeNickname) {
      toast.error("Você já atingiu o limite de trocas de nickname!");
      return;
    }

    const userRef = ref(database, `users/${user.uid}/updateNick/${user.uid}`);
    try {
      await update(userRef, { nickname });
      const userUpdateRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userUpdateRef);
      const userData = snapshot.val();
      await update(userUpdateRef, { nicknameChangeCount: (userData.nicknameChangeCount || 0) + 1 });
      toast.success("Perfil atualizado com sucesso!");
      if (location.state?.from) {
        navigate(location.state.from);
      }
    } catch (error) {
      toast.error("Erro ao atualizar perfil!");
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="relative min-h-screen bg-cover bg-center bg-black flex">
        <div className="flex-1 p-6 flex items-center justify-center bg-black">
          <div className="w-full max-w-md bg-[#1a1a1a] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">Atualizar Perfil</h2>

            <div className="space-y-6">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Digite seu nickname"
                autoComplete="off"
                className="w-full p-3 border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
              />
              <button
                onClick={handleUpdateProfile}
                className="w-full px-4 py-2 rounded-lg bg-[#605f5f] text-white font-semibold hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
              >
                Salvar Nickname
              </button>
            </div>
          </div>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
