import React, { useEffect, useState } from "react";

const WarningModal = () => {
  const [visibleWarnings, setVisibleWarnings] = useState([]);

  const warnings = [
    {
      id: "welcome-message",
      title: "Bem-vindo!",
      content: "Este site foi criado para reunir pessoas interessadas em comentar e avaliar seus conteúdos favoritos.",
    },
    {
      id: "no-piracy",
      title: "Diga não à pirataria!",
      content: "Não hospedamos filmes ou séries. Nosso foco é promover interação entre usuários sobre obras culturais.",
    },
    {
      id: "respect-rules",
      title: "Respeite as Regras",
      content: "Comportamentos como ofensas ou assédio não serão tolerados. Respeite os outros usuários!",
    },
    {
      id: "development",
      title: "Site em manutenção!",
      content: "Atenção, usuários! Informamos que o site está em fase de manutenção. Durante esse período, alguns conteúdos serão removidos para melhorias, mas não se preocupe, novos conteúdos serão adicionados em breve. Essa manutenção é essencial para aprimorar a performance e a experiência geral do site. Caso enfrente algum problema ou tenha dúvidas, entre em contato conosco pelo link do GitHub disponível no rodapé da página. Agradecemos pela compreensão!",
    },
  ];

  useEffect(() => {
    const unseenWarnings = warnings.filter((warning) => {
      const hasSeen = localStorage.getItem(`hasSeen_${warning.id}`);
      return !hasSeen;
    });
    setVisibleWarnings(unseenWarnings);
  }, []);

  const handleClose = () => {
    visibleWarnings.forEach((warning) => {
      localStorage.setItem(`hasSeen_${warning.id}`, "true");
    });
    setVisibleWarnings([]);
  };

  if (visibleWarnings.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-xl w-full mx-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-red-600">
          Avisos Importantes
        </h2>
        {visibleWarnings.map((warning, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              {warning.title}
            </h3>
            <p className="text-sm md:text-base text-gray-700">{warning.content}</p>
          </div>
        ))}
        <button
          onClick={handleClose}
          className="w-full py-2 px-4 bg-[#605f5f] text-white font-semibold rounded-lg hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
        >
          Entendi
        </button>
      </div>
    </div>
  );
};

export default WarningModal;
