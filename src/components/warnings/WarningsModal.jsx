import React, { useEffect, useState, useRef } from "react";
import { AlertTriangle, Info, ShieldCheck, Wrench, X } from "lucide-react";

const WarningModal = () => {
  const [visibleWarnings, setVisibleWarnings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null); // Para guardar a referência do intervalo

  const warnings = [
    {
      id: "welcome-message",
      title: "Bem-vindo ao br14nfilmes!",
      content:
        "Este site foi criado para reunir pessoas interessadas em comentar e avaliar seus conteúdos favoritos, além de organizar sessões de filmes e séries para assistir em plataformas licenciadas.",
      icon: <Info size={24} className="text-sky-400" />,
      type: "info",
    },
    {
      id: "no-piracy",
      title: "Diga Não à Pirataria!",
      content:
        "Não hospedamos filmes ou séries. Nosso foco é promover interação entre usuários sobre obras culturais e o uso legal de plataformas de streaming.",
      icon: <ShieldCheck size={24} className="text-green-400" />,
      type: "security",
    },
    {
      id: "respect-rules",
      title: "Respeite as Regras da Comunidade",
      content:
        "Comportamentos como ofensas, spam ou assédio não serão tolerados. Mantenha um ambiente respeitoso e positivo para todos os usuários!",
      icon: <AlertTriangle size={24} className="text-yellow-400" />,
      type: "warning",
    },
    {
      id: "maintenance-20250129",
      title: "Manutenção Finalizada - 29/01/2025!",
      content:
        "Atenção, usuário! A manutenção foi concluída com sucesso! Agora, o site está mais rápido e com uma experiência muito mais fluida. Também aprimoramos a segurança e a privacidade dos seus dados. A partir de agora, novos conteúdos serão adicionados gradualmente ao longo das próximas semanas. Caso tenha algum problema ou sugestão, sinta-se à vontade para nos enviar uma mensagem pelo chat. Alguns componentes podem apresentar um design diferente, mas isso será ajustado em breve para alinhar com a identidade visual do site. Agradecemos pela paciência e confiança!",
      icon: <Wrench size={24} className="text-blue-400" />,
      type: "update",
    },
  ];

  useEffect(() => {
    const unseenWarnings = warnings.filter((warning) => {
      const hasSeen = localStorage.getItem(`hasSeen_${warning.id}`);
      return !hasSeen;
    });
    if (unseenWarnings.length > 0) {
      setVisibleWarnings(unseenWarnings);
      setShowModal(true);
      if (unseenWarnings.length === 1) {
        setScrolledToEnd(true);
      } else {
        setScrolledToEnd(false);
      }
    }
  }, []);

  const checkScrollEnd = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const isContentSmaller = container.scrollHeight <= container.clientHeight;
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 5;

      if (isContentSmaller || isAtBottom) {
        setScrolledToEnd(true);
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
          scrollIntervalRef.current = null;
        }
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (showModal && container) {
      if (visibleWarnings.length <= 1 || container.scrollHeight <= container.clientHeight) {
        setScrolledToEnd(true);
        return; // Não precisa de auto-scroll nem listener
      }

      if (visibleWarnings.length > 1 && !scrolledToEnd) {
        const scrollStep = 1;
        const scrollDelay = 40;

        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
        }

        scrollIntervalRef.current = setInterval(() => {
          if (checkScrollEnd()) {
            return;
          }
          container.scrollTop += scrollStep;
        }, scrollDelay);

        container.addEventListener('scroll', checkScrollEnd);

        return () => {
          if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
          }
          if (container) {
            container.removeEventListener('scroll', checkScrollEnd);
          }
        };
      }
    }
  }, [showModal, visibleWarnings, scrolledToEnd]);

  const handleClose = () => {
    if (!scrolledToEnd && visibleWarnings.length > 1) return;

    visibleWarnings.forEach((warning) => {
      localStorage.setItem(`hasSeen_${warning.id}`, "true");
    });
    setShowModal(false);
    setTimeout(() => setVisibleWarnings([]), 300);
  };

  if (!showModal || visibleWarnings.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[1000] p-4 transition-opacity duration-300 ease-in-out animate-fadeIn">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d2d2d;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div className="bg-[#1c1c1c] rounded-xl shadow-2xl max-w-lg w-full mx-auto p-6 sm:p-8 space-y-6 border border-gray-700 animate-scaleUp animation-duration-300 ease-out">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-red-500 flex items-center">
            <AlertTriangle size={28} className="mr-3 text-red-500" />
            Avisos Importantes
          </h2>
          <button
            onClick={handleClose}
            className={`text-gray-400 hover:text-white transition-colors ${(!scrolledToEnd && visibleWarnings.length > 1) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!scrolledToEnd && visibleWarnings.length > 1}
            aria-label="Fechar avisos"
          >
            <X size={24} />
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          className="space-y-4 overflow-y-auto max-h-80 pr-2 custom-scrollbar border-t border-b border-gray-700 py-4"
        >
          {visibleWarnings.map((warning) => (
            <div
              key={warning.id}
              className="p-4 bg-[#2a2a2a] rounded-lg border border-gray-600 shadow-md transition-all hover:shadow-lg"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">{warning.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-1">
                    {warning.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{warning.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleClose}
          className={`w-full py-3 px-5 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${scrolledToEnd || visibleWarnings.length === 1
              ? "bg-[#505050] text-white hover:bg-[#454545] focus:ring-[#605f5f]"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          disabled={!scrolledToEnd && visibleWarnings.length > 1}
        >
          Entendi e Fechar
        </button>
      </div>
    </div>
  );
};

export default WarningModal;
