import { ref, update, get, getDatabase, push, serverTimestamp } from "firebase/database";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { database } from "../../services/firebaseConfig/FirebaseConfig";
import Footer from "../../components/footer/Footer";
import Faq from "../../components/faq/Faq";
import { UserCog, CheckCircle, AlertTriangle, Save, RefreshCw, Info, Mail, CalendarPlus, UserCircle as UserIcon, Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/loading/Loading";

const thematicWords = {
  movies: ["Cine", "Filme", "Peli", "Blockbuster", "Oscar", "Diretor", "Roteiro", "Sessao", "Pipoca", "Tela", "Astro"],
  series: ["Serie", "Episodio", "Maratona", "Show", "Fluxo", "Temporada", "TV", "Box", "Spoiler", "Final", "Plot"],
  animes: ["Anime", "Otaku", "Kawaii", "Sensei", "Shonen", "Manga", "Waifu", "Cosplay", "Sakura", "Isekai", "Mecha"],
  general: ["Fan", "Critico", "Amante", "Expert", "Viciado", "Clube", "Zone", "World", "Hub", "Geek", "Nerd"]
};

const generateRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const UpdateProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [nickname, setNickname] = useState("");
  const [debouncedNickname, setDebouncedNickname] = useState("");
  const [currentNickname, setCurrentNickname] = useState("");
  const [message, setMessage] = useState({ text: "", type: "", suggestions: [] });
  const [loadingSave, setLoadingSave] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [nicknameChangeCount, setNicknameChangeCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const NICKNAME_CHANGE_LIMIT = 3;
  const DEBOUNCE_DELAY = 750;

  const formatCreationTime = (timestamp) => {
    if (!timestamp) return "Data não disponível";
    try {
      return new Date(timestamp).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return "Data inválida";
    }
  };

  const fetchUserProfile = useCallback(async () => {
    if (user) {
      setInitialLoading(true);
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const fetchedNickname = userData.nickname || `Usuário_${user.uid.substring(0, 5)}`;
          setCurrentNickname(fetchedNickname);
          setNickname(fetchedNickname);
          setDebouncedNickname(fetchedNickname);
          setNicknameChangeCount(userData.nicknameChangeCount || 0);
        } else {
          const defaultNickname = `Usuário_${user.uid.substring(0, 5)}`;
          setCurrentNickname(defaultNickname);
          setNickname(defaultNickname);
          setDebouncedNickname(defaultNickname);
          await set(userRef, {
            email: user.email,
            nickname: defaultNickname,
            nicknameChangeCount: 0,
            photoURL: user.photoURL || null,
            role: "user",
            createdAt: user.metadata.creationTime || serverTimestamp(),
            dbCreatedAt: serverTimestamp()
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setMessage({ text: "Erro ao carregar dados do perfil.", type: "error", suggestions: [] });
      } finally {
        setInitialLoading(false);
      }
    } else {
      setInitialLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const nicknameInputRef = useRef(nickname);
  useEffect(() => {
    nicknameInputRef.current = nickname;
  }, [nickname]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedNickname(nicknameInputRef.current);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [nickname]);


  const clearMessage = () => {
    setMessage({ text: "", type: "", suggestions: [] });
  };

  const checkNicknameExists = async (newNicknameToCheck) => {
    if (!newNicknameToCheck || !user) return false;
    const lowerNickname = newNicknameToCheck.toLowerCase();
    const usersRef = ref(database, "users");
    try {
      const snapshot = await get(usersRef);
      const usersData = snapshot.val();
      if (usersData) {
        for (let uidInUsers in usersData) {
          if (uidInUsers !== user.uid) {
            const userNode = usersData[uidInUsers];
            if (userNode.nickname && userNode.nickname.toLowerCase() === lowerNickname) {
              return true;
            }
          }
        }
      }
      return false;
    } catch (error) {
      console.error("Erro ao verificar nickname:", error);
      setMessage({ text: "Erro ao verificar o nickname!", type: "error", suggestions: [] });
      return true;
    }
  };

  const generateNicknameSuggestions = async (baseName) => {
    let suggestions = [];
    let attempts = 0;
    const MAX_SUGGESTION_ATTEMPTS = 30;
    const base = baseName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10) || generateRandomElement(thematicWords.general);

    while (suggestions.length < 3 && attempts < MAX_SUGGESTION_ATTEMPTS) {
      attempts++;
      const themeType = generateRandomElement(Object.keys(thematicWords));
      const thematicWord = generateRandomElement(thematicWords[themeType]);
      const randomNumber = Math.floor(10 + Math.random() * 900);

      let suggestion;
      const type = Math.random();
      if (type < 0.33) {
        suggestion = `${thematicWord}${base}${randomNumber}`;
      } else if (type < 0.66) {
        suggestion = `${base}${thematicWord}${randomNumber}`;
      } else {
        suggestion = `${thematicWord}${randomNumber}${base}`;
      }
      suggestion = suggestion.replace(/\s+/g, '').substring(0, 20);

      if (suggestion.length >= 3 && !(await checkNicknameExists(suggestion)) && !suggestions.includes(suggestion)) {
        suggestions.push(suggestion);
      }
    }
    return suggestions;
  };

  useEffect(() => {
    const processDebouncedNickname = async () => {
      const nicknameToProcess = debouncedNickname; // CORREÇÃO AQUI: Usar o estado debouncedNickname
      if (!user || !nicknameToProcess.trim() || nicknameToProcess.trim().toLowerCase() === currentNickname.toLowerCase() || nicknameToProcess.trim().length < 3) {
        if (message.type !== 'success' && message.type !== 'error' && message.text !== "O novo nickname é igual ao atual." && message.text !== "Verificando disponibilidade...") {
          setMessage({ text: "", type: "", suggestions: [] });
        }
        return;
      }

      setSuggestionsLoading(true);
      setMessage({ text: "Verificando disponibilidade...", type: "info", suggestions: [] });
      const exists = await checkNicknameExists(nicknameToProcess.trim());
      if (exists) {
        const newSuggestions = await generateNicknameSuggestions(nicknameToProcess.trim());
        setMessage({
          text: "Este nickname já está em uso!",
          type: "error",
          suggestions: newSuggestions.length > 0 ? newSuggestions : ["Tente uma variação diferente ou adicione números."]
        });
      } else {
        setMessage({ text: "Nickname disponível!", type: "success", suggestions: [] });
      }
      setSuggestionsLoading(false);
    };

    if (debouncedNickname && user) {
      processDebouncedNickname();
    }

  }, [debouncedNickname, currentNickname, user]); // Removido generateNicknameSuggestions e checkNicknameExists das dependências diretas, pois são estáveis ou chamadas internamente


  const handleUpdateProfile = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoadingSave(true);
    const trimmedNickname = nickname.trim();
    if (message.type === 'info' || message.type === 'success' || (message.type === 'error' && message.text === "Este nickname já está em uso!")) {
      setMessage({ text: "", type: "", suggestions: [] });
    }

    if (!trimmedNickname) {
      setMessage({ text: "O nickname não pode estar vazio!", type: "error", suggestions: [] });
      setLoadingSave(false);
      return;
    }
    if (trimmedNickname.length < 3 || trimmedNickname.length > 20) {
      setMessage({ text: "O nickname deve ter entre 3 e 20 caracteres.", type: "error", suggestions: [] });
      setLoadingSave(false);
      return;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(trimmedNickname)) {
      setMessage({ text: "Nickname inválido. Use apenas letras, números e os caracteres . _ -", type: "error", suggestions: [] });
      setLoadingSave(false);
      return;
    }

    if (trimmedNickname.toLowerCase() === currentNickname.toLowerCase()) {
      setMessage({ text: "O novo nickname é igual ao atual.", type: "info", suggestions: [] });
      setLoadingSave(false);
      return;
    }

    if (nicknameChangeCount >= NICKNAME_CHANGE_LIMIT) {
      setMessage({ text: `Você atingiu o limite de ${NICKNAME_CHANGE_LIMIT} trocas de nickname!`, type: "error", suggestions: [] });
      setLoadingSave(false);
      return;
    }

    const nicknameExists = await checkNicknameExists(trimmedNickname);
    if (nicknameExists) {
      const suggestions = await generateNicknameSuggestions(trimmedNickname);
      setMessage({
        text: "Este nickname já está em uso!",
        type: "error",
        suggestions: suggestions.length > 0 ? suggestions : ["Tente uma variação diferente ou adicione números."]
      });
      setLoadingSave(false);
      return;
    }

    const userRef = ref(database, `users/${user.uid}`);
    const nicknameHistoryRef = ref(database, `users/${user.uid}/nicknameHistory`);

    try {
      const updates = {};
      updates['nickname'] = trimmedNickname;
      updates['nicknameChangeCount'] = nicknameChangeCount + 1;

      if (currentNickname && currentNickname !== `Usuário_${user.uid.substring(0, 5)}`) {
        await push(nicknameHistoryRef, {
          oldNickname: currentNickname,
          changedAt: serverTimestamp()
        });
      }

      await update(userRef, updates);

      if (setUser) {
        setUser(prevUser => ({
          ...prevUser,
          nickname: trimmedNickname,
        }));
      }
      setCurrentNickname(trimmedNickname);
      setNicknameChangeCount(nicknameChangeCount + 1);
      setDebouncedNickname(trimmedNickname);

      setMessage({ text: "Nickname atualizado com sucesso!", type: "success", suggestions: [] });
      toast.success("Nickname atualizado com sucesso!");

      if (location.state?.from && location.state?.needsNickname) {
        setTimeout(() => navigate(location.state.from), 1500);
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMessage({ text: "Erro ao atualizar o nickname. Tente novamente.", type: "error", suggestions: [] });
      toast.error("Erro ao atualizar o nickname.");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSuggestionClick = (suggestedNick) => {
    setNickname(suggestedNick);
    setMessage({ text: "Nickname disponível!", type: "success", suggestions: [] });
  }

  const handleForceGenerateSuggestions = async () => {
    if (!nickname.trim() || nickname.trim().toLowerCase() === currentNickname.toLowerCase()) {
      toast.info("Digite um novo nickname para gerar sugestões.");
      return;
    }
    setSuggestionsLoading(true);
    setMessage({ text: "Gerando sugestões...", type: "info", suggestions: [] });
    const newSuggestions = await generateNicknameSuggestions(nickname.trim());
    if (newSuggestions.length > 0) {
      setMessage({ text: "Sugestões para você:", type: "info", suggestions: newSuggestions });
    } else {
      setMessage({ text: "Não encontramos boas sugestões, tente algo diferente.", type: "info", suggestions: [] });
    }
    setSuggestionsLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-black">
        <Sidebar />
        <div className="flex-grow md:ml-20 flex items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-gray-300">
      <Sidebar />
      <div className="flex-grow md:ml-20 transition-all duration-300 ease-in-out flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 space-y-8">

          {user && (
            <div className="w-full max-w-lg bg-[#1c1c1c] p-6 sm:p-8 shadow-2xl rounded-xl border border-gray-800/70 mt-8">
              <div className="text-center mb-6">
                <UserIcon size={48} className="mx-auto text-emerald-500 mb-3" />
                <h2 className="text-2xl font-bold text-white">Detalhes da Conta</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center p-3 bg-[#2d2d2d]/70 rounded-md border border-gray-700/50">
                  <Mail size={18} className="text-emerald-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-400 mr-2">E-mail:</span>
                  <span className="text-gray-200 truncate">{user.email}</span>
                </div>
                <div className="flex items-center p-3 bg-[#2d2d2d]/70 rounded-md border border-gray-700/50">
                  <CalendarPlus size={18} className="text-emerald-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-400 mr-2">Membro desde:</span>
                  <span className="text-gray-200">{formatCreationTime(user.metadata?.creationTime)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="w-full max-w-lg bg-[#1c1c1c] p-6 sm:p-8 shadow-2xl rounded-xl border border-gray-800/70">
            <div className="text-center mb-8">
              <UserCog size={48} className="mx-auto text-sky-500 mb-3" />
              <h1 className="text-3xl font-bold text-white">Atualizar Nickname</h1>
              <p className="text-gray-400 mt-1">Seu nickname atual: <strong className="text-sky-400">{currentNickname}</strong></p>
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg text-sm text-center flex flex-col items-center justify-center space-y-2
                ${message.type === 'success' ? 'bg-green-600/20 text-green-300 border border-green-500/30' : ''}
                ${message.type === 'error' ? 'bg-red-600/20 text-red-300 border border-red-500/30' : ''}
                ${message.type === 'info' ? 'bg-sky-600/20 text-sky-300 border border-sky-500/30' : ''}
              `}>
                <div className="flex items-center">
                  {message.type === 'success' && <CheckCircle size={18} className="mr-2" />}
                  {message.type === 'error' && <AlertTriangle size={18} className="mr-2" />}
                  {message.type === 'info' && (suggestionsLoading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Info size={18} className="mr-2" />)}
                  <span>{message.text}</span>
                </div>
                {message.suggestions && message.suggestions.length > 0 && (message.type === 'error' || message.type === 'info') && !suggestionsLoading && (
                  <div className="pt-2 border-t border-gray-600/50 w-full">
                    <p className="text-xs text-gray-400 mb-1.5 mt-1">
                      {message.type === 'error' ? 'Algumas sugestões disponíveis:' : 'Sugestões para você:'}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {message.suggestions.map((sugg, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(sugg)}
                          className="text-xs bg-sky-700/60 hover:bg-sky-600/80 text-sky-200 px-2.5 py-1 rounded-md transition-colors"
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Novo Nickname (trocas restantes: {Math.max(0, NICKNAME_CHANGE_LIMIT - nicknameChangeCount)})
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Digite seu novo nickname"
                    autoComplete="off"
                    className="w-full px-4 py-2.5 border border-gray-700 bg-[#2d2d2d] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors placeholder-gray-500 pr-10"
                  />
                  <button
                    onClick={handleForceGenerateSuggestions}
                    disabled={suggestionsLoading || !nickname.trim() || nickname.trim().toLowerCase() === currentNickname.toLowerCase()}
                    className="absolute right-2 p-1.5 text-sky-400 hover:text-sky-300 disabled:text-gray-600 disabled:cursor-not-allowed rounded-full hover:bg-sky-700/30 transition-colors"
                    title="Gerar sugestões"
                    type="button"
                  >
                    {suggestionsLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Entre 3-20 caracteres. Letras, números e ( . _ - ) são permitidos.</p>
                <p className="text-xs text-gray-500 mt-0.5">Máximo de {NICKNAME_CHANGE_LIMIT} trocas permitidas.</p>
              </div>
              <button
                onClick={handleUpdateProfile}
                disabled={loadingSave || nicknameChangeCount >= NICKNAME_CHANGE_LIMIT || nickname.trim().toLowerCase() === currentNickname.toLowerCase() || !nickname.trim() || (message.type === 'error' && message.text === "Este nickname já está em uso!") || (message.type === 'info' && message.text === "Verificando disponibilidade...")}
                className="w-full py-3 px-5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loadingSave ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Salvar Nickname
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-400 text-xs text-center mt-6">
              Seu nickname é usado para identificar você em recomendações, comentários e sessões.
            </p>
            <p className="mt-4 text-center text-gray-400 text-sm">
              Deseja trocar a senha?{" "}
              <Link
                to="/reset-password"
                className="font-medium text-sky-400 hover:text-sky-300 hover:underline"
              >
                Clique aqui
              </Link>
            </p>
          </div>
        </main>
        <Faq />
        <Footer />
        <ToastContainer />
      </div>
    </div>
  );
};

export default UpdateProfile;
