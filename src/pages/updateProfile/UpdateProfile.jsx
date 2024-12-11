import { ref, update, get } from "firebase/database";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { database } from "../../services/firebaseConfig/FirebaseConfig";
import Footer from "../../components/footer/Footer";
import Faq from "../../components/faq/Faq";

const UpdateProfile = () => {
  const { user } = useContext(AuthContext);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const clearMessage = () => {
    setMessage("");
  };

  const checkNicknameExists = async (newNickname) => {
    const usersRef = ref(database, "users");
    try {
      const snapshot = await get(usersRef);
      const users = snapshot.val();

      for (let key in users) {
        if (
          users[key]?.updateNick?.[key]?.nickname === newNickname &&
          key !== user.uid
        ) {
          return true;
        }
      }

      return false;
    } catch (error) {
      setMessage("Erro ao verificar o nickname!");
      return false;
    }
  };

  const checkNicknameChangeLimit = async () => {
    const userRef = ref(database, `users/${user.uid}`);
    try {
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      const currentCount = userData.nicknameChangeCount || 0;

      if (currentCount >= 3) {
        setMessage("Você já atingiu o limite de trocas de nickname!");
        return false;
      }

      return true;
    } catch (error) {
      setMessage("Erro ao verificar o limite de trocas de nickname!");
      return false;
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) {
      return navigate("/login");
    }

    if (!nickname.trim()) {
      setMessage("O campo nickname não pode estar vazio!");
      return;
    }

    const nicknameExists = await checkNicknameExists(nickname);

    if (nicknameExists) {
      setMessage("Nickname já em uso! Escolha outro.");
      return;
    }

    const canChangeNickname = await checkNicknameChangeLimit();

    if (!canChangeNickname) {
      return;
    }

    const userRef = ref(database, `users/${user.uid}/updateNick/${user.uid}`);
    try {
      await update(userRef, { nickname });

      const userUpdateRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userUpdateRef);
      const userData = snapshot.val();
      const updatedNicknameChangeCount =
        (userData.nicknameChangeCount || 0) + 1;

      await update(userUpdateRef, {
        nicknameChangeCount: updatedNicknameChangeCount,
      });

      setMessage("Perfil atualizado com sucesso!");
      if (location.state?.from) {
        navigate(location.state.from);
      }
    } catch (error) {
      setMessage("Erro ao atualizar perfil!");
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="relative min-h-screen bg-cover bg-center bg-black flex">
        <div className="flex-1 p-6 flex items-center justify-center bg-black">
          <div className="w-full max-w-md bg-[#1a1a1a] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Atualizar Perfil
            </h2>

            {message && (
              <div className="mb-4 p-2 text-center text-white bg-blue-800 rounded-lg">
                {message}
              </div>
            )}

            <div className="space-y-6">
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  clearMessage();
                }}
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
            <p className="text-gray-300 text-sm justify-center text-center mt-2">
              Atualize o seu nickname para poder interagir
            </p>
            <p className="mt-2 text-center text-gray-300 text-sm">
              Deseja trocar a senha?{" "}
              <Link
                to="/reset-password"
                className="text-blue-500 hover:underline"
              >
                Clique aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Faq />
      <Footer />
    </div>
  );
};

export default UpdateProfile;
