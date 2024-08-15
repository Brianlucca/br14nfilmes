import { Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white p-4">
      <div className="container mx-auto text-center">
        <p>&copy;2024 AinzOoal Films</p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="" target="_blank" rel="noopener noreferrer">
            <Github className="text-white hover:text-gray-400" size={24} />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer">
            <Linkedin className="text-white hover:text-gray-400" size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
