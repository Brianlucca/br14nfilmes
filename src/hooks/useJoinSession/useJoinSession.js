import {
  get,
  limitToLast,
  query,
  ref,
  set,
  orderByChild,
  equalTo,
  push,
} from "firebase/database";
import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { database } from "../../services/firebaseConfig/FirebaseConfig";

export const useJoinSession = () => {
  const [sessionCode, setSessionCode] = useState("");
  const [recentSessions, setRecentSessions] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [loadingGlobalSessions, setLoadingGlobalSessions] = useState(true);
  const [loadingMySessions, setLoadingMySessions] = useState(true);
  const [joiningSession, setJoiningSession] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const fetchRecentGlobalSessions = useCallback(async () => {
    if (!user) return;
    setLoadingGlobalSessions(true);
    try {
      const recentSessionsQuery = query(
        ref(database, "sessions"),
        orderByChild("createdAt"),
        limitToLast(10), // Pode aumentar o limite se desejar
      );
      const snapshot = await get(recentSessionsQuery);
      if (snapshot.exists()) {
        const sessionsData = snapshot.val();
        const sessionsArray = Object.keys(sessionsData).map((key) => ({
          sessionCode: key,
          ...sessionsData[key],
        }));
        setRecentSessions(sessionsArray.reverse());
      } else {
        setRecentSessions([]);
      }
    } catch (error) {
      console.error("Erro ao buscar sessões recentes da comunidade:", error);
      setRecentSessions([]);
    } finally {
      setLoadingGlobalSessions(false);
    }
  }, [user]);

  const fetchUserCreatedSessions = useCallback(async () => {
    if (!user) return;
    setLoadingMySessions(true);
    try {
      const userSessionsQuery = query(
        ref(database, "sessions"),
        orderByChild("createdByUid"), // Agora busca pelo UID do criador
        equalTo(user.uid),
      );
      const snapshot = await get(userSessionsQuery);
      if (snapshot.exists()) {
        const sessionsData = snapshot.val();
        const sessionsArray = Object.keys(sessionsData)
          .map((key) => ({
            sessionCode: key,
            ...sessionsData[key],
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMySessions(sessionsArray);
      } else {
        setMySessions([]);
      }
    } catch (error) {
      console.error("Erro ao buscar suas sessões criadas:", error);
      setMySessions([]);
    } finally {
      setLoadingMySessions(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      toast.error("Você precisa estar logado para participar ou ver sessões.");
      navigate("/login", { state: { from: location.pathname } });
      setLoadingGlobalSessions(false);
      setLoadingMySessions(false);
      return;
    }
    fetchRecentGlobalSessions();
    fetchUserCreatedSessions();
  }, [
    user,
    navigate,
    location.pathname,
    fetchRecentGlobalSessions,
    fetchUserCreatedSessions,
  ]);

  const joinSessionLogic = async (codeToJoin) => {
    if (!user) {
      toast.error("Usuário não autenticado.");
      return false;
    }

    setJoiningSession(true);
    try {
      const sessionRef = ref(database, `sessions/${codeToJoin}`);
      const sessionSnapshot = await get(sessionRef);

      if (sessionSnapshot.exists()) {
        const userProfileRef = ref(database, `users/${user.uid}`);
        const userProfileSnapshot = await get(userProfileRef);

        let userNickname = `Usuário-${user.uid.substring(0, 5)}`;
        let userPhotoURL = user.photoURL || null;

        if (userProfileSnapshot.exists()) {
          const profileData = userProfileSnapshot.val();
          userNickname =
            profileData.updateNick?.[user.uid]?.nickname ||
            profileData.nickname ||
            userNickname;
          userPhotoURL = profileData.photoURL || user.photoURL || null;
        } else {
          navigate("/profile", {
            state: { from: location.pathname, needsNickname: true },
          });
          toast.info(
            "Por favor, configure seu nickname no perfil antes de entrar.",
          );
          setJoiningSession(false);
          return false;
        }

        const participantsRef = ref(
          database,
          `sessions/${codeToJoin}/participants`,
        );
        const currentParticipantRef = ref(
          database,
          `sessions/${codeToJoin}/participants/${user.uid}`,
        ); // Referência direta ao participante pelo UID
        const participantSnapshot = await get(currentParticipantRef);

        if (!participantSnapshot.exists()) {
          await set(currentParticipantRef, {
            uid: user.uid,
            nickname: userNickname,
            photoURL: userPhotoURL,
            joinedAt: serverTimestamp(),
          });
        }
        navigate(`/watchsession/${codeToJoin}`);
        return true;
      } else {
        toast.error("Código da sessão inválido ou a sessão não existe mais.");
        return false;
      }
    } catch (error) {
      console.error("Erro ao entrar na sessão:", error);
      toast.error("Erro ao tentar entrar na sessão.");
      return false;
    } finally {
      setJoiningSession(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    const codeToJoin = sessionCode.trim().toUpperCase();
    if (!codeToJoin) {
      toast.error("Por favor, insira o código da sessão.");
      return;
    }
    await joinSessionLogic(codeToJoin);
  };

  const handleInputChange = (e, sessionKey) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [sessionKey]: e.target.value.toUpperCase(),
    }));
  };

  const handleJoinSpecificSession = async (code, sessionKey) => {
    const codeToJoin = code?.trim().toUpperCase();
    const keyToJoin = sessionKey?.trim().toUpperCase();

    if (!codeToJoin || !keyToJoin) {
      toast.error("Código da sessão não fornecido.");
      return;
    }
    if (codeToJoin !== keyToJoin) {
      toast.error(
        "O código inserido não corresponde ao da sessão selecionada.",
      );
      return;
    }
    await joinSessionLogic(codeToJoin);
  };

  const handleDirectJoinMySession = async (codeToJoin) => {
    if (!codeToJoin) {
      toast.error("Código da sessão inválido.");
      return;
    }
    await joinSessionLogic(codeToJoin.trim().toUpperCase());
  };

  return {
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
  };
};
