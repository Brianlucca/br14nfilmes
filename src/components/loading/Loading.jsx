import './Style.css';

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="flex flex-col justify-center items-center space-y-4">
        <div className="loader"></div>
        <p className="text-gray-400">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;
