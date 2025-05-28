import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Message } from "rsuite";
import { auth } from "../../services/firebaseConfig/FirebaseConfig";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha em instantes.",
      );
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Nenhuma conta encontrada com este endereço de e-mail.");
      } else if (err.code === "auth/invalid-email") {
        setError("O formato do e-mail fornecido é inválido.");
      } else {
        setError(
          "Não foi possível enviar o e-mail de redefinição. Tente novamente mais tarde.",
        );
      }
    } finally {
      setLoading(false);
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
    <div className="flex justify-center items-center min-h-screen bg-black px-4 text-gray-300">
      <div className="w-full max-w-md p-8 bg-[#1c1c1c] shadow-2xl rounded-xl border border-gray-800/70">
        <div className="flex flex-col items-center mb-6">
          <KeyRound size={48} className="text-sky-500 mb-4" />
          <h1 className="text-3xl font-bold text-white">Redefinir Senha</h1>
          <p className="text-gray-400 mt-2 text-center text-sm">
            Insira seu e-mail para receber o link de redefinição.
          </p>
        </div>

        {message && (
          <Message
            showIcon
            type="success"
            closable
            className="mb-4 !bg-green-600/20 !text-green-300 !border !border-green-500/50"
          >
            {message}
          </Message>
        )}
        {error && (
          <Message
            showIcon
            type="error"
            closable
            className="mb-4 !bg-red-600/20 !text-red-300 !border !border-red-500/50"
          >
            {error}
          </Message>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Seu Endereço de E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors placeholder-gray-500"
                required
                autoComplete="email"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <Mail size={18} className="mr-2" />
                Enviar Link de Redefinição
              </>
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={handleGoBack}
            className="text-sm text-sky-400 hover:text-sky-300 hover:underline flex items-center justify-center mx-auto"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            Voltar para Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
