import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { loginUser } from "../../services/authService/AuthService";
import { Message } from 'rsuite';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userData = await loginUser(email, password);
      if (login) {
        login(userData);
      }
      navigate("/");
    } catch (err) {
      setError(`Email ou senha incorretos. Tente novamente. Caso o problema persista, entre em contato - contatobr14nfilmes@gmail.com`);
      console.error("Erro no login:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-gray-300 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-[#1c1c1c] shadow-2xl rounded-xl overflow-hidden">
        
        <div className="hidden md:flex md:w-1/2 p-8 sm:p-12 flex-col items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#111111] relative">
          <img 
            src="/logo.png" 
            alt="Logo br14nfilmes" 
            className="w-40 h-40 mb-6 rounded-full shadow-lg" 
          />
          <h2 className="text-3xl font-bold text-white mb-3 text-center">br14nfilmes</h2>
          <p className="text-gray-400 text-center text-sm">
            Explore, avalie e organize suas sessões de filmes e séries. <br /> Acesse sua conta para começar!
          </p>
          <div className="absolute bottom-4 left-4 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} br14nfilmes
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-[#1a1a1a]">
          <div className="flex flex-col items-center mb-6 md:hidden">
            <img src="/logo.png" alt="Logo br14nfilmes" className="w-20 h-20 mb-3" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">Bem-vindo de Volta!</h1>
          <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center text-gray-400">Acesse sua conta</h2>

          {error && (
            <Message type="error" closable className="mb-4 !bg-red-700 !text-white">
               {error}
            </Message>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full px-4 py-2.5 border border-gray-700 bg-[#2d2d2d] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#605f5f] focus:border-transparent transition-all duration-200"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-2.5 border border-gray-700 bg-[#2d2d2d] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#605f5f] focus:border-transparent transition-all duration-200"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#505050] text-white font-semibold rounded-lg hover:bg-[#454545] focus:outline-none focus:ring-2 focus:ring-[#5a5a5a] focus:ring-opacity-75 transition-colors duration-200"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-center text-sm">
            Não tem uma conta?{" "}
            <Link to="/register" className="font-medium text-[#41b9dd] hover:text-[#63c9e7] hover:underline">
              Faça o cadastro
            </Link>
          </p>
          <p className="mt-2 text-center text-sm">
            Esqueceu sua senha?{" "}
            <Link to="/reset-password" className="font-medium text-[#41b9dd] hover:text-[#63c9e7] hover:underline">
              Clique aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
