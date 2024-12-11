import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#424242] text-white p-6">
      <div className="container mx-auto text-center md:text-left grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:ml-20">
        <div className="flex flex-col items-center sm:items-start">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-32 h-auto mb-4"
          />
          <p className="text-sm">&copy; 2024 br14nfilmes</p>
          <p className="text-sm">Site desenvolvido por {''}<a href="https://github.com/Brianlucca" target="_blank" rel="noopener noreferrer" className="underline">Brian Lucca</a></p>
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h3 className="font-semibold text-lg mb-3">Links Rápidos</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline">Início</a></li>
            <li><a href="/Join-session" className="hover:underline">Assistir em Grupo</a></li>
            <li><a href="/favorites" className="hover:underline">Favoritos</a></li>
            <li><a href="/profile" className="hover:underline">Perfil</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h3 className="font-semibold text-lg mb-3">Contato</h3>
          <p className="text-sm mb-2">Entre em contato conosco via e-mail:</p>
          <a href="mailto:contatobr14nfilmes@gmail.com" className="text-sm text-blue-400 hover:underline">contatobr14nfilmes@gmail.com</a>
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h3 className="font-semibold text-lg mb-3">Redes Sociais</h3>
          <div className="flex space-x-4">
            <a href="https://www.linkedin.com/in/brian-lucca-cardozo" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-blue-700">
              <Linkedin size={24} />
            </a>
            <a href="https://github.com/Brianlucca" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-black">
              <Github size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-5"></div>
    </footer>
  );
};

export default Footer;
