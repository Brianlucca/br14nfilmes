import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ref, get, query, limitToLast } from "firebase/database";
import { database } from "../../services/firebaseConfig/FirebaseConfig";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../components/sidebar/Sidebar";

const JoinSession = () => {
  const [sessionCode, setSessionCode] = useState("");
  const [recentSessions, setRecentSessions] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      toast.error("Você precisa estar logado para participar");
      navigate('/login');
      return;
    }

    const fetchRecentSessions = async () => {
      try {
        const recentSessionsQuery = query(ref(database, 'sessions'), limitToLast(5));
        const snapshot = await get(recentSessionsQuery);

        if (snapshot.exists()) {
          const sessionsData = snapshot.val();
          const sessionsArray = Object.keys(sessionsData).map(key => ({
            sessionCode: key,
            ...sessionsData[key]
          }));
          setRecentSessions(sessionsArray.reverse());
        }
      } catch (error) {
        toast.error("Erro ao buscar as sessões recentes.");
      }
    };

    fetchRecentSessions();
  }, [user, navigate]);

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!sessionCode) {
      toast.error("Por favor, insira o código da sessão.");
      return;
    }

    try {
      const sessionRef = ref(database, `sessions/${sessionCode}`);
      const snapshot = await get(sessionRef);

      if (snapshot.exists()) {
        navigate(`/watchsession/${sessionCode}`);
      } else {
        toast.error("Código da sessão inválido.");
      }
    } catch (error) {
      toast.error("Erro ao verificar o código da sessão.");
    }
  };

  const handleInputChange = (e, sessionKey) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [sessionKey]: e.target.value,
    }));
  };

  const handleJoinSpecificSession = async (code, sessionKey) => {
    try {
      const sessionRef = ref(database, `sessions/${sessionKey}`);
      const snapshot = await get(sessionRef);

      if (snapshot.exists() && code === sessionKey) {
        navigate(`/watchsession/${code}`);
      } else {
        toast.error("Código da sessão inválido.");
      }
    } catch (error) {
      toast.error("Erro ao verificar o código da sessão.");
    }
  };

  return (
    <div>
    <Sidebar />
    <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
      <div className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8">
        <div className="bg-[#1a1a1a] p-6 shadow-lg rounded-lg w-full max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center lg:text-left text-gray-100">Entrar na Sessão</h1>
          <form onSubmit={handleJoin}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2">Código da Sessão</label>
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
          <h2 className="text-xl font-semibold mb-4 text-center lg:text-left text-gray-100">Últimas Sessões Criadas</h2>
          <div className="flex-1 space-y-4">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <div key={session.sessionCode} className="p-4 bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-700">
                  <h3 className="text-lg font-bold text-gray-200">{session.sessionName || "Sessão Sem Nome"}</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Criado por: <span className="font-semibold text-green-300">{session.createdBy || "Anônimo"}</span>
                  </p>
                  <p className="text-gray-400 text-sm mb-2">{session.description || "Sem descrição disponível."}</p>
                  <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                    <input
                      type="text"
                      placeholder="Código da Sessão"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-[#434343] text-white focus:outline-none focus:ring-2 focus:ring-[#605f5f]"
                      value={inputValues[session.sessionCode] || ""}
                      onChange={(e) => handleInputChange(e, session.sessionCode)}
                    />
                    <button
                      onClick={() => handleJoinSpecificSession(inputValues[session.sessionCode], session.sessionCode)}
                      className="w-full lg:w-auto px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700"
                    >
                      Acessar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400">Nenhuma sessão recente disponível.</div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
};

export default JoinSession;
