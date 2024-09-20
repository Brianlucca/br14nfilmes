import React from "react";

const WelcomeModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-xl w-full mx-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-red-600">
          Aviso Importante
        </h2>
        <p className="text-sm md:text-base text-gray-700 mb-4">
          Este site foi criado para reunir pessoas interessadas em comentar e
          avaliar seus conteúdos favoritos. Vale lembrar que não hospedamos
          filmes, séries, documentários ou animes; nosso foco é promover a
          interação entre os usuários sobre essas obras.
        </p>
        <p className="text-sm md:text-base text-gray-700 mb-4">
          <strong>Diga não à pirataria.</strong> Caso não encontre o conteúdo
          que procura, você pode recomendá-lo aos administradores e aguardar a
          sua inclusão. Além disso, comportamentos como ofensas, homofobia,
          xenofobia, assédio ou difamação não serão tolerados. Qualquer violação
          dessas regras resultará em banimento. Respeite os outros usuários!
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-[#605f5f] text-white font-semibold rounded-lg hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
        >
          Entendi
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
