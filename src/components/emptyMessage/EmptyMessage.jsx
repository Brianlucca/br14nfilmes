import React from 'react';
import Sidebar from '../sidebar/Sidebar';

const EmptyMessage = () => {
  return (
    <div>
      <Sidebar />
    <div className="flex items-center justify-center h-screen bg-black p-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl md:text-9xl font-extrabold text-gray-400 animate-bounce">
          Opa!
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mt-6">
          Não tem nada aqui.
        </p>
        <p className="text-gray-500 mt-4 mb-8">
          Parece que não há favoritos.
        </p>
      </div>
    </div>
    </div>
  );
};

export default EmptyMessage;
