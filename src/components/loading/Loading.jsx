import React from 'react';
import './Style.css';

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="flex flex-col justify-center items-center space-y-5"> 
        <div className="pulsing-dots-loader">
          <span style={{ backgroundColor: 'rgb(14 165 233)' }}></span> 
          <span style={{ backgroundColor: 'rgb(14 165 233)' }}></span> 
          <span style={{ backgroundColor: 'rgb(14 165 233)' }}></span> 
        </div>
        <p className="text-slate-400 text-sm">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;