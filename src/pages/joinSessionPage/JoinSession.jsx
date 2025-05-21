import React from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import { useJoinSession } from "../../hooks/useJoinSession/useJoinSession";
import { LogIn, History, Edit3, ChevronRight, ImageIcon, ListVideo } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/loading/Loading";

const JoinSession = () => {
  const {
    sessionCode,
    recentSessions,
    mySessions,
    inputValues,
    setSessionCode,
    handleJoin,
    handleInputChange,
    handleJoinSpecificSession,
    handleDirectJoinMySession,
    loadingGlobalSessions,
    loadingMySessions,
    joiningSession,
  } = useJoinSession();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-gray-300">
      <Sidebar />
      <main className="flex-grow md:ml-20 p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-8">
          <div className="bg-[#1c1c1c] p-6 sm:p-8 shadow-2xl rounded-xl border border-gray-800/70">
            <div className="flex flex-col items-center text-center mb-6">
              <LogIn size={48} className="text-sky-500 mb-3" />
              <h1 className="text-3xl font-bold text-white">
                Entrar em uma Sessão
              </h1>
              <p className="text-gray-400 mt-1">Insira o código para participar de uma watch party.</p>
            </div>
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label htmlFor="sessionCodeGlobal" className="sr-only">
                  Código da Sessão
                </label>
                <input
                  type="text"
                  id="sessionCodeGlobal"
                  value={sessionCode}
                  placeholder="Digite o Código da Sessão"
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-700 bg-[#2d2d2d] text-white text-center text-lg tracking-wider font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors placeholder-gray-500"
                  required
                  maxLength={6} 
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <button
                type="submit"
                disabled={joiningSession && !!sessionCode}
                className="w-full px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {joiningSession && !!sessionCode ? (
                   <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn size={20} className="mr-2" />
                    Entrar na Sessão
                  </>
                )}
              </button>
            </form>
          </div>

          {loadingMySessions ? (
            <div className="bg-[#1c1c1c] p-6 sm:p-8 shadow-2xl rounded-xl border border-gray-800/70 text-center">
              <Loading />
              <p className="mt-2 text-gray-400">Carregando suas sessões...</p>
            </div>
          ) : (
            mySessions && mySessions.length > 0 && (
            <div className="bg-[#1c1c1c] p-6 sm:p-8 shadow-2xl rounded-xl border border-gray-800/70">
              <div className="flex flex-col items-center text-center mb-6">
                <ListVideo size={40} className="text-emerald-500 mb-3" />
                <h2 className="text-2xl font-semibold text-white">
                  Minhas Sessões Criadas
                </h2>
                <p className="text-gray-400 mt-1">Acesse rapidamente as sessões que você iniciou.</p>
              </div>
              <div className="space-y-4">
                {mySessions.map((session) => (
                  <div
                    key={session.sessionCode}
                    className="p-4 bg-[#2a2a2a]/80 rounded-lg shadow-md border border-gray-700/60 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    {session.image ? (
                        <img src={session.image} alt={session.nameContent || "Capa da sessão"} className="w-full sm:w-20 h-auto sm:h-28 object-cover rounded-md border border-gray-600"/>
                    ) : (
                        <div className="w-full sm:w-20 h-28 bg-gray-700/50 rounded-md flex items-center justify-center flex-shrink-0">
                            <ImageIcon size={32} className="text-gray-500"/>
                        </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-emerald-300 break-words">
                        {session.sessionName || "Sessão Sem Nome"}
                      </h3>
                      <p className="text-xs text-gray-400 mb-1">
                        Conteúdo: <span className="font-medium text-gray-300">{session.nameContent || "Não especificado"}</span>
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        Código: <span className="font-mono text-emerald-400 tracking-wider">{session.sessionCode}</span>
                      </p>
                    </div>
                    <div className="w-full sm:w-auto flex-shrink-0 mt-2 sm:mt-0">
                      <button
                        onClick={() => handleDirectJoinMySession(session.sessionCode)}
                        disabled={joiningSession}
                        className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors flex items-center justify-center disabled:opacity-60"
                      >
                        {joiningSession && inputValues[session.sessionCode] === undefined ? ( 
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                Entrar Direto <ChevronRight size={18} className="ml-1.5" />
                            </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )
          )}

          {loadingGlobalSessions ? (
            <div className="bg-[#1c1c1c] p-6 sm:p-8 shadow-2xl rounded-xl border border-gray-800/70 text-center">
              <Loading />
              <p className="mt-2 text-gray-400">Carregando sessões da comunidade...</p>
            </div>
          ) : (
            recentSessions && recentSessions.length > 0 && (
            <div className="bg-[#1c1c1c] p-6 sm:p-8 shadow-2xl rounded-xl border border-gray-800/70">
              <div className="flex flex-col items-center text-center mb-6">
                <History size={40} className="text-sky-500 mb-3" />
                <h2 className="text-2xl font-semibold text-white">
                  Sessões Ativas da Comunidade
                </h2>
                <p className="text-gray-400 mt-1">Veja as watch parties disponíveis ou entre com um código.</p>
              </div>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session.sessionCode}
                    className="p-4 bg-[#2a2a2a]/80 rounded-lg shadow-md border border-gray-700/60 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    {session.image ? (
                        <img src={session.image} alt={session.nameContent || "Capa da sessão"} className="w-full sm:w-20 h-auto sm:h-28 object-cover rounded-md border border-gray-600"/>
                    ) : (
                        <div className="w-full sm:w-20 h-28 bg-gray-700/50 rounded-md flex items-center justify-center flex-shrink-0">
                            <ImageIcon size={32} className="text-gray-500"/>
                        </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-sky-300 break-words">
                        {session.sessionName || "Sessão Sem Nome"}
                      </h3>
                      <p className="text-xs text-gray-400 mb-1">
                        Conteúdo: <span className="font-medium text-gray-300">{session.nameContent || "Não especificado"}</span>
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        Criada por:{" "}
                        <span className="font-medium text-gray-300">
                          {session.createdBy || "Usuário"} 
                        </span>
                      </p>
                      {session.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                          {session.description}
                        </p>
                      )}
                    </div>
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0 mt-2 sm:mt-0">
                      <input
                        type="text"
                        placeholder="Código"
                        className="w-full sm:w-32 px-3 py-2 border border-gray-600 rounded-md bg-[#434343] text-white text-center font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-gray-500"
                        value={inputValues[session.sessionCode] || ""}
                        onChange={(e) => handleInputChange(e, session.sessionCode)}
                        maxLength={6}
                        style={{ textTransform: 'uppercase' }}
                      />
                      <button
                        onClick={() =>
                          handleJoinSpecificSession(
                            inputValues[session.sessionCode],
                            session.sessionCode
                          )
                        }
                        disabled={joiningSession && inputValues[session.sessionCode]}
                        className="w-full sm:w-auto px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors flex items-center justify-center disabled:opacity-60"
                      >
                        {joiningSession && inputValues[session.sessionCode] ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <ChevronRight size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )
          )}
        </div>
        <ToastContainer />
      </main>
    </div>
  );
};

export default JoinSession;
