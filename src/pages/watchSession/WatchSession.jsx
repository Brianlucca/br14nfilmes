import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ChatSession from "../../components/chatSession/ChatSession";
import Loading from "../../components/loading/Loading";
import Sidebar from "../../components/sidebar/Sidebar";
import useWatchSession from "../../hooks/useWatchSession/useWatchSession";
import { User } from "lucide-react";

const WatchSession = () => {
  const { sessionCode } = useParams();
  const { session, progress, participants, handleCheckboxChange, handleDeleteSession, handleShare } = useWatchSession(sessionCode);

  if (!session) {
    return <Loading />;
  }

  const totalEpisodes = session?.episodes || 0;
  const completedEpisodes = session.isSeries
    ? Object.keys(progress).filter((ep) => progress[ep] === 100).length
    : progress.completed ? 1 : 0;

  const totalProgress = totalEpisodes > 0
    ? (completedEpisodes / totalEpisodes) * 100
    : progress.completed ? 100 : 0;

  return (
    <div>
      <Sidebar />
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${session.image})` }}
      >
        <div className="flex-1 p-6 lg:ml-16 bg-black">
          <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg mb-6">
            <div className="w-full bg-gradient-to-r from-blue-500 to-teal-500 h-5 rounded-full relative">
              <div className="bg-red-300 h-full rounded-full" style={{ width: `${totalProgress}%` }} />
              <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
                {Math.round(totalProgress)}%
              </span>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Participantes</h2>
            <ul className="space-y-2">
              {participants.length > 0 ? (
                participants.map((participant, index) => (
                  <li key={index} className="flex items-center text-lg text-gray-300 border border-gray-700 p-2 rounded-md shadow-md">
                    <User className="mr-2 text-gray-400" />
                    <span>{participant.nickname}</span>
                  </li>
                ))
              ) : (
                <li className="text-lg text-gray-300">Nenhum participante</li>
              )}
            </ul>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg mb-6">
            <h1 className="text-lg font-bold mb-4 text-[#605f5f]">Sessão criada para assistir - {session.nameContent}</h1>
            <h1 className="text-4xl font-bold mb-4 text-white">{session.sessionName}</h1>
            <p className="text-lg text-gray-300 mb-4">{session.description}</p>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">Código da Sessão:</h2>
              <p onClick={handleShare} className="text-xl text-[#ec4141] font-semibold cursor-pointer hover:underline w-20">
                {sessionCode}
              </p>
            </div>

            {session.isSeries ? (
              <div className="max-h-96 overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4 text-white">Progresso dos Episódios</h2>
                <div className="space-y-2">
                  {Array.from({ length: session.episodes }).map((_, index) => {
                    const episode = index + 1;
                    return (
                      <div key={episode} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`episode-${episode}`}
                          checked={progress[episode] === 100}
                          onChange={() => handleCheckboxChange(episode)}
                          className="form-checkbox"
                        />
                        <label htmlFor={`episode-${episode}`} className="text-lg text-white">Episódio {episode}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="completed"
                  checked={progress.completed || false}
                  onChange={() => handleCheckboxChange()}
                  className="form-checkbox"
                />
                <label htmlFor="completed" className="text-lg text-white">Marcar como Assistido/Concluído</label>
              </div>
            )}
          </div>

          {totalProgress === 100 && (
            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Parabéns!</h2>
              <p className="text-lg text-gray-300 mb-4">Você concluiu a sessão! Agora precisamos finalizar a sua sessão, aperte o botão para finalizar</p>
              <div className="flex justify-end">
                <button
                  onClick={handleDeleteSession}
                  className="bg-[#605f5f] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#4d4d4d]"
                >
                  Finalizar Sessão
                </button>
              </div>
            </div>
          )}

          <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg mb-6">
            <ChatSession sessionCode={sessionCode} />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDeleteSession}
              className="bg-[#605f5f] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#4d4d4d]"
            >
              Deletar Sessão
            </button>
          </div>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default WatchSession;
