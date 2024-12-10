import { useEffect, useState } from "react";
import { auth } from "../../services/firebaseConfig/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        setIsVerified(user.emailVerified);
        if (user.emailVerified) {
          navigate("/login");
        }
      }
    };

    const interval = setInterval(checkVerification, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-sm p-8 bg-[#1a1a1a] shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Verifique seu email</h2>
        <p className="text-gray-300 text-center mb-4">
          Um email de verificação foi enviado para o seu endereço. Confirme para continuar.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
