import { useState, useContext } from "react";
import { Home, Info, Phone, Menu, User, Star, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { logout } from "../../services/authService/AuthService"; // Importe a função de logout

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 bg-gray-700 text-white h-screen p-4 shadow-md transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } z-50`} 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex flex-col items-start">
        <Link to="/" className="flex items-center space-x-2 mb-6">
          <Menu className="w-10 h-6" />
          {isOpen && (
            <span className="text-lg font-semibold">AinzOoal Films</span>
          )}
        </Link>
        <nav className="flex flex-col space-y-4">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
          >
            <Home className="w-6 h-6" />
            {isOpen && <span className="text-lg">Home</span>}
          </Link>
          <Link
            to="/about"
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
          >
            <Info className="w-6 h-6" />
            {isOpen && <span className="text-lg">Sobre</span>}
          </Link>
          <Link
            to="/contact"
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
          >
            <Phone className="w-6 h-6" />
            {isOpen && <span className="text-lg">Contato</span>}
          </Link>
          <Link
            to={isAdmin ? "/admin" : "/recommendations"}
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
          >
            {isAdmin ? (
              <>
                <User className="w-6 h-6" />
                {isOpen && <span className="text-lg">Admin</span>}
              </>
            ) : (
              <>
                <Star className="w-6 h-6" />
                {isOpen && <span className="text-lg">Recomendações</span>}
              </>
            )}
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 mt-6 hover:bg-gray-700 p-2 rounded-md"
        >
          <LogOut className="w-6 h-6" />
          {isOpen && <span className="text-lg">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
