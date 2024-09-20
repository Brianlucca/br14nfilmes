import React from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import { useCreateSession } from "../../hooks/useCreateSession/useCreateSession";

const CreateSession = () => {
  const {
    sessionName,
    setSessionName,
    description,
    setDescription,
    isSeries,
    setIsSeries,
    episodes,
    setEpisodes,
    content,
    sessionCode,
    imageUrl,
    setImageUrl,
    nameContent,
    setNameContent,
    driveFilm,
    setDriveFilm,
    handleSubmit
  } = useCreateSession();

  return (
    <div>
      <Sidebar className="lg:w-1/4" />
      <div className="justify-center flex flex-col lg:flex-row bg-black min-h-screen">
        <div className="flex-1 max-w-md mx-auto p-6 bg-[#1a1a1a] shadow-lg rounded-lg lg:max-w-4xl lg:mx-6 lg:py-8">
          {content && (
            <div className="mb-6">
              <img
                src={content.imageUrl}
                alt={content.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2 text-white">{content.name}</h2>
              <p className="text-gray-300">{content.description}</p>
            </div>
          )}
          <h1 className="text-2xl font-bold mb-6 text-white">Criar Sessão</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Crie o nome da sessão
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Crie a descrição da sessão
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-4 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                checked={isSeries}
                onChange={() => setIsSeries(!isSeries)}
                className="form-checkbox"
              />
              <label className="ml-2 text-gray-300">É uma série ou anime?</label>
            </div>
            {isSeries && (
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Quantidade de Episódios
                </label>
                <input
                  type="number"
                  value={episodes}
                  onChange={(e) => setEpisodes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
                  min="1"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#605f5f] text-white font-semibold rounded-md shadow-md hover:bg-[#4d4d4d]"
            >
              Criar Sessão
            </button>
          </form>
          {sessionCode && (
            <div className="mt-4 p-4 bg-[#4d4d4d] border border-gray-700 rounded-lg">
              <h2 className="text-lg font-semibold text-white">Código da Sessão:</h2>
              <p className="text-gray-300">{sessionCode}</p>
              <p className="text-gray-200">Compartilhe este código com seus colegas para que eles possam se juntar à sessão.</p>
            </div>
          )}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default CreateSession;
