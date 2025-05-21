import React from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ChatSession from "../../components/chatSession/ChatSession";
import Loading from "../../components/loading/Loading";
import Sidebar from "../../components/sidebar/Sidebar";
import useWatchSession from "../../hooks/useWatchSession/useWatchSession";
import { User, Users, ListChecks, ClipboardCopy, Trash2, Share2, CheckCircle, Info, MessageSquare, UserCircle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const WatchSession = () => {
  const { sessionCode } = useParams();
  const { session, progress, participants, handleCheckboxChange, handleDeleteSession, handleShare } = useWatchSession(sessionCode);

  if (!session) {
    return (
      <div className="flex h-screen bg-black">
        <Sidebar />
        <Loading />
      </div>
    );
  }

  const totalEpisodes = session?.episodes || 0;
  const completedEpisodes = session.isSeries
    ? Object.keys(progress).filter((ep) => progress[ep] === 100).length
    : progress.completed ? 1 : 0;

  const totalProgress = totalEpisodes > 0
    ? (completedEpisodes / totalEpisodes) * 100
    : progress.completed ? 100 : 0;

  const copyToClipboard = () => {
    if (sessionCode) {
      navigator.clipboard.writeText(sessionCode)
        .then(() => toast.success("Código da sessão copiado!"))
        .catch(err => toast.error("Falha ao copiar o código."));
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-gray-300">
      <Sidebar />
      <div className="flex-grow md:ml-20 relative">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-15 blur-sm"
          style={{ backgroundImage: `url(${session.image})` }}
        />
        <div className="absolute inset-0 w-full h-full bg-black/70 backdrop-blur-xs"></div>

        <main className="relative z-10 p-4 sm:p-6 lg:p-8 overflow-y-auto h-screen custom-scrollbar-dark">
          <style jsx global>{`
            .custom-scrollbar-dark::-webkit-scrollbar { width: 8px; }
            .custom-scrollbar-dark::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 10px; }
            .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #4a4a4a; border-radius: 10px; }
            .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover { background: #6a6a6a; }
          `}</style>
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 md:mb-10">
              <p className="text-sky-400 text-sm font-medium uppercase tracking-wider">
                Assistindo: {session.nameContent}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-1 break-words">
                {session.sessionName}
              </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#1c1c1c]/80 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-2xl border border-gray-800/60">
                  <h2 className="text-xl font-semibold text-white mb-3">Progresso da Sessão</h2>
                  <div className="w-full bg-gray-700/50 h-6 rounded-full relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-sky-500 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${totalProgress}%` }} 
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow-md">
                      {Math.round(totalProgress)}% Concluído
                    </span>
                  </div>
                </div>

                <div className="bg-[#1c1c1c]/80 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-2xl border border-gray-800/60">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <ListChecks size={24} className="mr-2 text-sky-400"/>
                    {session.isSeries ? "Progresso dos Episódios" : "Marcar como Assistido"}
                  </h2>
                  {session.isSeries ? (
                    <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar-dark pr-2">
                      {Array.from({ length: session.episodes || 0 }).map((_, index) => {
                        const episode = index + 1;
                        const isChecked = progress[episode] === 100;
                        return (
                          <div key={episode} className="flex items-center p-2.5 bg-gray-800/40 rounded-md hover:bg-gray-700/60 transition-colors">
                            <input
                              type="checkbox"
                              id={`episode-${episode}`}
                              checked={isChecked}
                              onChange={() => handleCheckboxChange(episode)}
                              className="h-5 w-5 text-sky-500 bg-gray-600 border-gray-500 rounded focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-[#1c1c1c] cursor-pointer"
                            />
                            <label htmlFor={`episode-${episode}`} className={`ml-3 text-base ${isChecked ? 'text-gray-400 line-through' : 'text-white'} cursor-pointer`}>
                              Episódio {episode}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center p-2.5 bg-gray-800/40 rounded-md hover:bg-gray-700/60 transition-colors">
                      <input
                        type="checkbox"
                        id="completed"
                        checked={progress.completed || false}
                        onChange={() => handleCheckboxChange()}
                        className="h-5 w-5 text-sky-500 bg-gray-600 border-gray-500 rounded focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-[#1c1c1c] cursor-pointer"
                      />
                      <label htmlFor="completed" className={`ml-3 text-base ${progress.completed ? 'text-gray-400 line-through' : 'text-white'} cursor-pointer`}>
                        Marcar como Assistido/Concluído
                      </label>
                    </div>
                  )}
                </div>
                
                {session.description && (
                    <div className="bg-[#1c1c1c]/80 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-2xl border border-gray-800/60">
                        <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
                            <Info size={22} className="mr-2 text-sky-400"/>
                            Sobre a Sessão
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed">{session.description}</p>
                    </div>
                )}

                {totalProgress === 100 && (
                  <div className="bg-gradient-to-br from-green-700/80 to-emerald-800/80 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-2xl border border-green-600/60 text-center">
                    <CheckCircle size={40} className="mx-auto text-green-300 mb-3"/>
                    <h2 className="text-2xl font-bold text-white mb-2">Parabéns!</h2>
                    <p className="text-lg text-green-200 mb-4">Você concluiu esta sessão!</p>
                    <button
                      onClick={handleDeleteSession}
                      className="w-full sm:w-auto mt-2 px-6 py-2.5 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 transition-colors"
                    >
                      Finalizar e Arquivar Sessão
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#1c1c1c]/80 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-2xl border border-gray-800/60">
                  <h2 className="text-xl font-semibold text-white mb-3">Código da Sessão</h2>
                  <div className="flex items-center justify-between space-x-2 bg-black/40 p-3 rounded-lg border border-gray-700">
                    <p className="text-2xl font-mono tracking-wider text-sky-300 select-all break-all">
                      {sessionCode}
                    </p>
                    <button 
                      onClick={copyToClipboard} 
                      className="p-2 text-gray-300 hover:text-sky-300 transition-colors rounded-md hover:bg-sky-700/50"
                      title="Copiar código"
                    >
                      <ClipboardCopy size={20} />
                    </button>
                  </div>
                   <button 
                      onClick={handleShare} 
                      className="mt-4 w-full px-4 py-2.5 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors flex items-center justify-center"
                    >
                      <Share2 size={18} className="mr-2"/>
                      Compartilhar Sessão
                    </button>
                </div>

                <div className="bg-[#1c1c1c]/80 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-2xl border border-gray-800/60">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Users size={22} className="mr-2 text-sky-400"/>
                    Participantes ({participants.length})
                  </h2>
                  <ul className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar-dark pr-1">
                    {participants.length > 0 ? (
                      participants.map((participant, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-200 bg-gray-800/40 p-2.5 rounded-md shadow">
                          {participant.photoURL ? (
                            <img src={participant.photoURL} alt={participant.nickname} className="w-7 h-7 rounded-full mr-2.5 object-cover border border-gray-600"/>
                          ): (
                            <UserCircle size={24} className="mr-2 text-gray-500" />
                          )}
                          <span>{participant.nickname}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-400 italic">Nenhum participante além de você.</li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-[#1c1c1c]/80 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-2xl border border-gray-800/60">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <MessageSquare size={22} className="mr-2 text-sky-400"/>
                      Chat da Sessão
                  </h2>
                  <ChatSession sessionCode={sessionCode} />
                </div>

                {totalProgress < 100 && (
                     <div className="mt-8 pt-6 border-t border-gray-700/50 flex justify-end">
                        <button
                        onClick={handleDeleteSession}
                        className="px-5 py-2.5 bg-red-700/90 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors flex items-center"
                        >
                        <Trash2 size={18} className="mr-2" />
                        Deletar Sessão
                        </button>
                    </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <ToastContainer />
      </div>
    </div>
  );
};

export default WatchSession;
