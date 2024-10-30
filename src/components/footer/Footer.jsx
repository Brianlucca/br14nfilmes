const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white p-4">
      <div className="container mx-auto text-center flex flex-col items-center">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-24 h-auto mb-1"
        />
        <p className="text-sm">&copy; 2024 AinzOoal Films</p>
        <p className="text-sm">Criador - <a href="https://github.com/Brianlucca" target="_blank" className="underline">Brian Lucca</a></p>
      </div>
    </footer>
  );
};

export default Footer;
