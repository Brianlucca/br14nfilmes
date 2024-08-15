import './Style.css'

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-64 h-32 bg-[#1a1a1a] rounded-lg p-4 flex flex-col justify-center items-center shadow-lg">
        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-gray-500 rounded-full animate-progress"></div>
        </div>
        <p className="mt-4 text-gray-400">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;
