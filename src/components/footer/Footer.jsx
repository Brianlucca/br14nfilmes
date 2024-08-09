const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white p-4">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 AinzOoal Films</p>
        <p>
          <a href="/" className="hover:underline">
            Termos de Serviço
          </a>{" "}
          |{" "}
          <a href="/" className="hover:underline">
            Política de Privacidade
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
