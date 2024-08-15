import { Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white p-4">
      <div className="container mx-auto text-center">
        <p>&copy;2024 AinzOoal Films</p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="https://github.com/Brianlucca" target="_blank" rel="noopener noreferrer">
            <Github className="text-white hover:text-gray-400" size={24} />
          </a>
          <a href="https://www.linkedin.com/in/brian-lucca-cardozo?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
            <Linkedin className="text-white hover:text-gray-400" size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
