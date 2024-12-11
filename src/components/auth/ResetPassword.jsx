import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebaseConfig/FirebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha.");
      setError(null);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError("Não foi possível enviar o e-mail de redefinição. Tente novamente mais tarde.");
      setMessage(null);
    }
  };

  const handleGoBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-sm p-8 bg-[#1a1a1a] shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Redefinir Senha</h2>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleReset}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
              required
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#605f5f] text-white font-semibold rounded-lg hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
          >
            Enviar e-mail de redefinição
          </button>
        </form>
        <p className="mt-5 text-center text-gray-300 text-sm">
          Voltar à página anterior?{" "}
          <span
            onClick={handleGoBack}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Clique aqui
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
