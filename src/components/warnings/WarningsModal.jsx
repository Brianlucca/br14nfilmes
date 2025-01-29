import React, { useEffect, useState, useRef } from "react";

const WarningModal = () => {
  const [visibleWarnings, setVisibleWarnings] = useState([]);
  const scrollContainerRef = useRef(null);

  const warnings = [
    {
      id: "welcome-message",
      title: "Bem-vindo!",
      content:
        "Este site foi criado para reunir pessoas interessadas em comentar e avaliar seus conteúdos favoritos.",
    },
    {
      id: "no-piracy",
      title: "Diga não à pirataria!",
      content:
        "Não hospedamos filmes ou séries. Nosso foco é promover interação entre usuários sobre obras culturais.",
    },
    {
      id: "respect-rules",
      title: "Respeite as Regras",
      content:
        "Comportamentos como ofensas ou assédio não serão tolerados. Respeite os outros usuários!",
    },
    {
      id: "feature",
      title: "Manutenção Finalizada - 29/01/2025!",
      content:
        "Atenção, usuário! A manutenção foi concluída com sucesso! Agora, o site está mais rápido e com uma experiência muito mais fluida. Também aprimoramos a segurança e a privacidade dos seus dados. A partir de agora, novos conteúdos serão adicionados gradualmente ao longo das próximas semanas. Caso tenha algum problema ou sugestão, sinta-se à vontade para nos enviar uma mensagem pelo chat. Alguns componentes podem apresentar um design diferente, mas isso será ajustado em breve para alinhar com a identidade visual do site. Agradecemos pela paciência e confiança!",
    },
  ];

  useEffect(() => {
    const unseenWarnings = warnings.filter((warning) => {
      const hasSeen = localStorage.getItem(`hasSeen_${warning.id}`);
      return !hasSeen;
    });
    setVisibleWarnings(unseenWarnings);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      let interval;
      const scrollStep = 1;
      const scrollDelay = 50;

      const startAutoScroll = () => {
        interval = setInterval(() => {
          if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            clearInterval(interval);
          } else {
            container.scrollTop += scrollStep;
          }
        }, scrollDelay);
      };

      startAutoScroll();

      return () => clearInterval(interval);
    }
  }, [visibleWarnings]);

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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-[#1a1a1a] rounded-lg shadow-lg max-w-md w-full mx-4 p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-red-500">
          Avisos Importantes
        </h2>
        <div
          ref={scrollContainerRef}
          className="space-y-4 overflow-y-auto max-h-72 border-t border-b border-gray-700 pt-4 pb-4"
        >
          {visibleWarnings.map((warning) => (
            <div
              key={warning.id}
              className="p-4 bg-[#2d2d2d] rounded-lg border border-gray-700 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                {warning.title}
              </h3>
              <p className="text-gray-400">{warning.content}</p>
            </div>
          ))}
        </div>
        <button
          onClick={handleClose}
          className="w-full py-3 px-5 bg-[#605f5f] text-white font-semibold rounded-lg hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f] transition-all"
        >
          Entendi
        </button>
      </div>
    </div>
  );
};

export default WarningModal;
