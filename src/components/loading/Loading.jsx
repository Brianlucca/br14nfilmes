import './Style.css'

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-64 h-32 border border-gray-300 rounded-lg p-4 flex flex-col justify-center items-center bg-white shadow-lg">
        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full animate-progress"></div>
        </div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;
