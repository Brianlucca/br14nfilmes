import {
  Github,
  Heart,
  Home,
  Linkedin,
  LogOut,
  Menu as MenuIcon,
  UserCircle as ProfileIcon,
  Star,
  Users,
  X,
} from "lucide-react";
import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../public/logo.png";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { logout } from "../../services/authService/AuthService";

const Sidebar = () => {
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {}
  };

  const navLinks = [
    { to: "/", text: "Início", icon: Home },
    { to: "/Join-session", text: "Sessões", icon: Users },
    { to: "/favorites", text: "Favoritos", icon: Heart },
    { to: "/recommendations", text: "Recomendar", icon: Star },
    { to: "/profile", text: "Perfil", icon: ProfileIcon },
  ];

  const NavLinkItem = ({
    to,
    text,
    IconComponent,
    isMobile = false,
    currentPath,
    isDesktopOpenState,
  }) => (
    <Link
      to={to}
      onClick={() => isMobile && setIsMobileMenuOpen(false)}
      className={`flex items-center space-x-3 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out group
                  ${
                    currentPath === to
                      ? "bg-sky-600 text-white shadow-md"
                      : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                  }
                  ${isMobile ? "text-lg w-full justify-start" : isDesktopOpenState ? "w-full" : "justify-center"}`}
      title={!isDesktopOpenState && !isMobile ? text : undefined}
    >
      <IconComponent
        size={isMobile ? 24 : 22}
        className="flex-shrink-0 transition-colors duration-200 group-hover:text-sky-300"
      />
      {(isDesktopOpenState || isMobile) && (
        <span className="whitespace-nowrap text-sm font-medium">{text}</span>
      )}
    </Link>
  );

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-[1001] bg-[#101014] text-white shadow-lg flex justify-between items-center px-4 h-16 border-b border-gray-800">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <img src={Logo} alt="Logo Br14nfilmes" className="h-8 w-auto" />
          <span className="text-xl font-bold text-white">Br14nfilmes</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
          aria-label="Abrir menu mobile"
        >
          <MenuIcon size={28} />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-[1002] bg-black/70 backdrop-blur-sm md:hidden transition-opacity duration-300 ease-in-out
                    ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 z-[1003] bg-[#101014] w-72 h-full shadow-xl flex flex-col p-6 transition-transform duration-300 ease-in-out md:hidden border-r border-gray-800
                    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <img src={Logo} alt="Logo Br14nfilmes" className="h-9 w-auto" />
            <span className="text-xl font-bold text-white">Br14nfilmes</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            aria-label="Fechar menu mobile"
          >
            <X size={28} />
          </button>
        </div>

        <nav className="flex-grow space-y-2.5">
          {navLinks.map((link) => (
            <NavLinkItem
              key={link.to + "-mobile"}
              {...link}
              IconComponent={link.icon}
              isMobile={true}
              currentPath={location.pathname}
              isDesktopOpenState={true}
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 py-2.5 px-3 rounded-lg text-gray-300 hover:bg-red-700/80 hover:text-white w-full text-base font-medium transition-colors duration-200"
          >
            <LogOut size={22} className="flex-shrink-0" />
            <span>Sair</span>
          </button>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 mb-2">
              © {new Date().getFullYear()} br14nfilmes
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.linkedin.com/in/brian-lucca-cardozo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-sky-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/Brianlucca"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`hidden md:fixed md:top-0 md:left-0 md:flex md:flex-col md:h-screen md:bg-[#101014] md:text-white md:shadow-xl md:border-r md:border-gray-800/50 transition-all duration-300 ease-in-out z-[999]
                    ${isDesktopOpen ? "w-60 p-5" : "w-[72px] p-3 items-center"}`}
        onMouseEnter={() => setIsDesktopOpen(true)}
        onMouseLeave={() => setIsDesktopOpen(false)}
      >
        <div
          className={`flex items-center mb-10 ${isDesktopOpen ? "self-start" : "justify-center w-full"}`}
        >
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={Logo}
              alt="Logo Br14nfilmes"
              className={`${isDesktopOpen ? "h-9" : "h-8"} w-auto transition-all duration-200`}
            />
            {isDesktopOpen && (
              <span className="text-xl font-bold text-white whitespace-nowrap">
                Br14nfilmes
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-grow flex flex-col space-y-2 w-full">
          {navLinks.map((link) => (
            <NavLinkItem
              key={link.to + "-desktop"}
              {...link}
              IconComponent={link.icon}
              isMobile={false}
              currentPath={location.pathname}
              isDesktopOpenState={isDesktopOpen}
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-700/50 w-full">
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-3 py-2.5 px-3 rounded-lg text-gray-300 hover:bg-red-700/80 hover:text-white w-full transition-colors duration-200 ${isDesktopOpen ? "" : "justify-center"}`}
            title={!isDesktopOpen ? "Sair" : undefined}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isDesktopOpen && (
              <span className="text-sm font-medium whitespace-nowrap">
                Sair
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
