import React from "react";

const WelcomeModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-xl w-full mx-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-red-600">
          Aviso Importante
        </h2>
        <p className="text-sm md:text-base text-gray-700 mb-4">
          Atenção: este site foi criado para uso pessoal, sem fins lucrativos. 
          Não há propagandas ou qualquer forma de monetização. 
          Se você está acessando este site, foi autorizado pelo administrador. 
          Portanto, não compartilhe ou mencione este site a pessoas não autorizadas.
        </p>
        <p className="text-sm md:text-base text-gray-700 mb-4">
          <strong>Diga não à pirataria.</strong> Caso não encontre o conteúdo desejado, 
          recomende aos administradores e aguarde até que ele seja adicionado. 
          Caso contrário, recomendamos que os usuários busquem um serviço de streaming licenciado. 
          Este site está sendo monitorado pelo criador, e qualquer comportamento fora dos termos aqui mencionados 
          poderá resultar no banimento do seu acesso.
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
