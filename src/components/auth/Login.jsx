import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { loginUser, loginAdmin } from "../../services/authService/AuthService";
import { AutoComplete } from 'rsuite';
import { Message } from 'rsuite';


const suffixes = [
  '@gmail.com',
  '@outlook.com',
  '@hotmail.com',
  '@yahoo.com',
];
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEmailChange = (value) => {
    setEmail(value);
    const at = value.match(/@[^\s]*/);
    const nextData = at
      ? suffixes
          .filter((item) => item.indexOf(at[0]) >= 0)
          .map((item) => `${value}${item.replace(at[0], '')}`)
      : suffixes.map((item) => `${value}${item}`);

    setData(nextData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      if (email === adminEmail && password === adminPassword) {
        await loginAdmin();
        navigate("/admin");
      } else {
        await loginUser(email, password);
        navigate("/");
      }
    } catch (error) {
      setError("Email ou senha incorretos. Tente novamente. caso tenha problema, entre em contato - contatobr14nfilmes@gmail.com");
    }
  };

  

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 bg-[#1a1a1a] shadow-lg rounded-lg">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Logo da Empresa" className="w-24 h-24 mb-4" />
          <h1 className="text-3xl font-bold text-white">Bem-vindo</h1>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-300">Entrar</h2>
        {error &&
         <Message type="warning">
        <p className="text-center">{error}</p>
        </Message>
        }
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <AutoComplete
              data={data}
              value={email}
              onChange={handleEmailChange}
              placeholder="Digite seu email"
              style={{ width: '100%'}}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full px-4 py-2 border border-gray-700 bg-[#181d316e] text-white rounded-md focus:outline-none focus:border-[#41b9dd] hover:border-[#41b9dd] transition-colors duration-200"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#605f5f] text-white font-semibold rounded-lg hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f] transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300 text-sm">
          Não tem uma conta? {" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Faça o cadastro
          </Link>
        </p>
        <p className="mt-2 text-center text-gray-300 text-sm">
          Esqueceu sua senha? {" "}
          <Link to="/reset-password" className="text-blue-500 hover:underline">
            Clique aqui
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
