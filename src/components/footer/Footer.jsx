import { Github, Linkedin, Mail, MapPin, Phone, Home, Users, Heart, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { href: "/", text: "Início", icon: <Home size={16} className="mr-2" /> },
    { href: "/Join-session", text: "Assistir em Grupo", icon: <Users size={16} className="mr-2" /> },
    { href: "/favorites", text: "Favoritos", icon: <Heart size={16} className="mr-2" /> },
    { href: "/profile", text: "Perfil", icon: <UserCircle size={16} className="mr-2" /> },
  ];

  const socialLinks = [
    { href: "https://www.linkedin.com/in/brian-lucca-cardozo", icon: <Linkedin size={22} />, label: "LinkedIn" },
    { href: "https://github.com/Brianlucca", icon: <Github size={22} />, label: "GitHub" },
  ];

  return (
    <footer className="bg-[#101014] text-gray-400 border-t border-gray-800/50">
      <div className="container mx-auto px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 md:ml-20">
          
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Link to="/" className="inline-block mb-4">
              <img 
                src="/logo.png" 
                alt="Logo br14nfilmes" 
                className="w-32 h-auto transition-opacity hover:opacity-80"
              />
            </Link>
            <p className="text-sm leading-relaxed">
              Sua plataforma para descobrir, avaliar e organizar sessões de filmes e séries.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200 mb-4">Links Rápidos</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm hover:text-sky-400 transition-colors duration-200 flex items-center">
                    {link.icon}
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200 mb-4">Contato</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start">
                <Mail size={16} className="mr-2.5 mt-1 text-sky-400 flex-shrink-0" />
                <a href="mailto:contatobr14nfilmes@gmail.com" className="hover:text-sky-400 transition-colors duration-200 break-all">
                  contatobr14nfilmes@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200 mb-4">Siga-nos</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-12 pt-8 border-t border-gray-800/50 text-center text-xs md:ml-20">
          <p>&copy; {new Date().getFullYear()} br14nfilmes. Todos os direitos reservados.</p>
          <p className="mt-1">
            Desenvolvido por <a href="https://github.com/Brianlucca" target="_blank" rel="noopener noreferrer" className="font-medium text-sky-400 hover:underline">Brian Lucca</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
