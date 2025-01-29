import { Github, Heart, Home, Linkedin, LogOut, Logs, Menu, SquarePen, Star, TvMinimalPlay, User, X } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { logout } from "../../services/authService/AuthService";
import Logo from "../../../public/logo.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAdmin } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div
      className={`relative md:flex md:flex-col md:items-start md:fixed top-0 left-0 md:bg-[#1a1a1a] md:text-white md:h-screen md:p-4 md:shadow-md transition-all duration-300`}
      style={{ zIndex: 1000 }}
    >
      <div className="md:hidden flex justify-between items-center p-4 bg-[#1a1a1a] text-white">
        <span className="text-lg font-semibold">Br14nfilmes</span>
        <span onClick={handleMobileMenuToggle}>
          <Logs className="w-8 h-8" />
        </span>
      </div>

      <div
        className={`fixed top-0 left-0 z-50 bg-[#1a1a1a] w-full h-full transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
      >
        <div className="flex flex-col items-center pt-12 opacity-80">
          <button
            onClick={closeMobileMenu}
            className="absolute top-4 right-4 text-white"
          >
            <X className="w-8 h-8" />
          </button>
          <Link
            to="/"
            className="text-lg font-semibold text-white hover:bg-[#333333] py-4 w-full text-center"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/Join-session"
            className="text-lg font-semibold text-white hover:bg-[#333333] py-4 w-full text-center"
            onClick={closeMobileMenu}
          >
            Assistir em Grupo
          </Link>
          <Link
            to="/favorites"
            className="text-lg font-semibold text-white hover:bg-[#333333] py-4 w-full text-center"
            onClick={closeMobileMenu}
          >
            Favoritos
          </Link>
          <Link
            to={isAdmin ? "/admin" : "/recommendations"}
            className="text-lg font-semibold text-white hover:bg-[#333333] py-4 w-full text-center"
            onClick={closeMobileMenu}
          >
            {isAdmin ? "Admin" : "Recomendações"}
          </Link>
          <Link
            to="/profile"
            className="text-lg font-semibold text-white hover:bg-[#333333] py-4 w-full text-center"
            onClick={closeMobileMenu}
          >
            Usuário
          </Link>
          <p
            onClick={handleLogout}
            className="text-lg font-semibold text-white hover:bg-[#333333] py-4 w-full text-center mt-auto"
          >
            Sair
          </p>

          <div className="mt-8 text-white text-center opacity-50">
            <p className="text-sm mb-4">© 2024 br14nfilmes</p>
            <div className="flex justify-center space-x-4 mb-4">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#0077b5]"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#333]"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
            <p className="text-sm">
              Entre em contato conosco via e-mail: <br />
              <a
                href="mailto:contatobr14nfilmes@gmail.com"
                className="text-white hover:text-[#ffac33]"
              >
                contatobr14nfilmes@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Menu Desktop */}
      <div
        className={`hidden md:block transition-all duration-300 ${
          isOpen ? "w-64 opacity-100" : "w-10 opacity-50"
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex flex-col items-start transition-all duration-300">
          <div
            className={`flex items-center mb-6 ${isOpen ? "w-64" : "w-16"} transition-all duration-300`}
          >
            <img src={Logo} alt="Logo" className="w-16 h-auto -ml-3" />
            {isOpen && (
              <span className="text-lg font-semibold ml-2">Br14nfilmes</span>
            )}
          </div>
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:bg-[#333333] p-2 rounded-md transition-all duration-300"
            >
              <Home className="w-6 h-6" />
              {isOpen && <span className="text-lg">Home</span>}
            </Link>
            <Link
              to="/Join-session"
              className="flex items-center space-x-2 hover:bg-[#333333] p-2 rounded-md transition-all duration-300"
            >
              <TvMinimalPlay className="w-6 h-6" />
              {isOpen && <span className="text-lg">Assistir em Grupo</span>}
            </Link>
            <Link
              to="/favorites"
              className="flex items-center space-x-2 hover:bg-[#333333] p-2 rounded-md transition-all duration-300"
            >
              <Heart className="w-6 h-6" />
              {isOpen && <span className="text-lg">Favoritos</span>}
            </Link>
            <Link
              to={isAdmin ? "/admin" : "/recommendations"}
              className="flex items-center space-x-2 hover:bg-[#333333] p-2 rounded-md transition-all duration-300"
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
            <Link
              to="/profile"
              className="flex items-center space-x-2 hover:bg-[#333333] p-2 rounded-md transition-all duration-300"
            >
              <SquarePen className="w-6 h-6" />
              {isOpen && <span className="text-lg">Usuário</span>}
            </Link>
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 mt-6 hover:bg-[#333333] p-2 rounded-md transition-all duration-300"
          >
            <LogOut className="w-6 h-6" />
            {isOpen && <span className="text-lg">Sair</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
