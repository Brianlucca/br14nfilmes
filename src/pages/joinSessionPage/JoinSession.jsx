import React from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";
import { useJoinSession } from "../../hooks/useJoinSession/useJoinSession";

const JoinSession = () => {
  const {
    sessionCode,
    recentSessions,
    inputValues,
    setSessionCode,
    handleJoin,
    handleInputChange,
    handleJoinSpecificSession,
  } = useJoinSession();

  return (
    <div>
      <Sidebar />
      <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
        <div className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8">
          <div className="bg-[#1a1a1a] p-6 shadow-lg rounded-lg w-full max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center lg:text-left text-gray-100">
              Entrar na Sessão
            </h1>
            <form onSubmit={handleJoin}>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Código da Sessão
                </label>
                <input
                  type="text"
                  value={sessionCode}
                  placeholder="Código da Sessão"
                  onChange={(e) => setSessionCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#605f5f] bg-[#434343] text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#605f5f] text-white font-semibold rounded-lg shadow-md hover:bg-[#2a2a2a]"
              >
                Entrar na Sessão
              </button>
            </form>
          </div>

          <div className="bg-[#1a1a1a] p-6 shadow-lg rounded-lg w-full max-w-lg mx-auto mt-6 lg:mt-8 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-center lg:text-left text-gray-100">
              Últimas Sessões Criadas
            </h2>
            <div className="flex-1 space-y-4">
              {recentSessions.length > 0 ? (
                recentSessions.map((session) => (
                  <div
                    key={session.sessionCode}
                    className="p-4 bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-700"
                  >
                    <h3 className="text-lg font-bold text-gray-200">
                      {session.sessionName || "Sessão Sem Nome"}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      Criado por:{" "}
                      <span className="font-semibold text-green-300">
                        {session.createdBy || "Anônimo"}
                      </span>
                    </p>
                    <p className="text-gray-400 text-sm mb-2">
                      {session.description || "Sem descrição disponível."}
                    </p>
                    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                      <input
                        type="text"
                        placeholder="Código da Sessão"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-[#434343] text-white focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
                        value={inputValues[session.sessionCode] || ""}
                        onChange={(e) => handleInputChange(e, session.sessionCode)}
                      />
                      <button
                        onClick={() =>
                          handleJoinSpecificSession(
                            inputValues[session.sessionCode],
                            session.sessionCode
                          )
                        }
                        className="w-full lg:w-auto px-4 py-2 bg-[#605f5f] text-white font-semibold rounded-lg shadow-md hover:bg-[#2a2a2a]"
                      >
                        Entrar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-300 text-center">Nenhuma sessão recente.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default JoinSession;
