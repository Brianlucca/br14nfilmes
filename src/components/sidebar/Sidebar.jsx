import { Heart, Home, LogOut, Menu, Star, User, Info, Phone, TvMinimalPlay } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { logout } from "../../services/authService/AuthService";

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

  return (
    <div
      className={`relative md:flex md:flex-col md:items-start md:fixed top-0 left-0 md:bg-gray-700 md:text-white md:h-screen md:p-4 md:shadow-md transition-all duration-300 ${
        isMobileMenuOpen ? "md:w-64" : "md:w-16"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-700 text-white">
        <span className="text-lg font-semibold">AinzOoal Films</span>
        <button onClick={handleMobileMenuToggle}>
          <Menu className="w-8 h-8" />
        </button>
      </div>

      <div
        className={`flex flex-col transition-all duration-300 ${
          isMobileMenuOpen ? "items-center" : "items-start"
        } md:items-start md:flex md:space-y-4 md:mt-6 ${
          isMobileMenuOpen ? "block" : "hidden md:block"
        }`}
      >
        {isMobileMenuOpen ? (
          <>
            <Link
              to="/"
              className="text-lg font-semibold hover:bg-gray-600 p-2 rounded-md w-full text-center"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-lg font-semibold hover:bg-gray-600 p-2 rounded-md w-full text-center"
            >
              Assistir Depois
            </Link>
            <Link
              to="/contact"
              className="text-lg font-semibold hover:bg-gray-600 p-2 rounded-md w-full text-center"
            >
              Favoritos
            </Link>
            <Link
              to={isAdmin ? "/admin" : "/recommendations"}
              className="text-lg font-semibold hover:bg-gray-600 p-2 rounded-md w-full text-center"
            >
              {isAdmin ? "Admin" : "Recomendações"}
            </Link>
            <button
              onClick={handleLogout}
              className="text-lg font-semibold hover:bg-gray-600 p-2 rounded-md w-full text-center mt-auto"
            >
              Logout
            </button>
          </>
        ) : (
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
                  className="flex items-center space-x-2 hover:bg-gray-600 p-2 rounded-md transition-all duration-300"
                >
                  <Home className="w-6 h-6" />
                  {isOpen && <span className="text-lg">Home</span>}
                </Link>
                <Link
                  to="/about"
                  className="flex items-center space-x-2 hover:bg-gray-600 p-2 rounded-md transition-all duration-300"
                >
                  <TvMinimalPlay className="w-6 h-6" />
                  {isOpen && <span className="text-lg">Assistir Depois</span>}
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center space-x-2 hover:bg-gray-600 p-2 rounded-md transition-all duration-300"
                >
                  <Heart className="w-6 h-6" />
                  {isOpen && <span className="text-lg">Favoritos</span>}
                </Link>
                <Link
                  to={isAdmin ? "/admin" : "/recommendations"}
                  className="flex items-center space-x-2 hover:bg-gray-600 p-2 rounded-md transition-all duration-300"
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
                className="flex items-center space-x-2 mt-6 hover:bg-gray-600 p-2 rounded-md transition-all duration-300"
              >
                <LogOut className="w-6 h-6" />
                {isOpen && <span className="text-lg">Logout</span>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
