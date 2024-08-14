import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl md:text-9xl font-extrabold text-gray-400 animate-bounce">
          404
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mt-6">
          Oops! Página não encontrada.
        </p>
        <p className="text-gray-500 mt-4 mb-8">
          Parece que você está perdido. Vamos te levar de volta!
        </p>
        <Link
          to="/"
          className="px-6 py-2 md:px-8 md:py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300 ease-in-out"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
