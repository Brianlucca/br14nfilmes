import { get, ref, serverTimestamp, set } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // Adicionado useLocation
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { database } from "../../services/firebaseConfig/FirebaseConfig";

export const useCreateSession = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [sessionName, setSessionName] = useState("");
  const [description, setDescription] = useState("");
  const [isSeries, setIsSeries] = useState(false);
  const [episodes, setEpisodes] = useState(1);
  const [content, setContent] = useState(null);
  const [sessionCode, setSessionCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      try {
        const categories = ["movies", "series", "animes", "documentaries"];
        let foundContent = null;

        for (const category of categories) {
          const contentRef = ref(database, `${category}/${id}`);
          const snapshot = await get(contentRef);
          if (snapshot.exists()) {
            foundContent = snapshot.val();
            foundContent.type = category.slice(0, -1);
            break;
          }
        }

        if (foundContent) {
          setContent(foundContent);
          setSessionName(foundContent.name || "");
          if (foundContent.type === "serie" || foundContent.type === "anime") {
            setIsSeries(true);
            setEpisodes(foundContent.episodes || 1);
          } else {
            setIsSeries(false);
            setEpisodes(1);
          }
        } else {
          toast.error("Conteúdo não encontrado para criar a sessão.");
          navigate("/");
        }
      } catch (error) {
        toast.error("Erro ao buscar informações do conteúdo.");
      }
    };

    fetchContent();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    if (!user) {
      toast.error("Você precisa estar logado para criar uma sessão");
      navigate("/login", { state: { from: location.pathname } });
      setLoadingSubmit(false);
      return;
    }

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
      toast.warn(
        "Por favor, crie um nickname no seu perfil antes de criar uma sessão.",
      );
      navigate("/profile", {
        state: { from: location.pathname, needsNickname: true },
      });
      setLoadingSubmit(false);
      return;
    }

    if (!sessionName.trim()) {
      toast.error("O nome da sessão é obrigatório.");
      setLoadingSubmit(false);
      return;
    }

    const generatedSessionCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const newSession = {
      sessionName: sessionName.trim(),
      description: description.trim(),
      isSeries,
      episodes: isSeries ? parseInt(episodes, 10) || 1 : 1,
      sessionCode: generatedSessionCode,
      createdBy: userNickname,
      createdByUid: user.uid,
      createdAt: serverTimestamp(),
      image: content?.imageUrl || "",
      contentId: id,
      nameContent: content?.name || "Conteúdo Desconhecido",
      contentType: content?.type || "desconhecido",
      participants: {
        [user.uid]: {
          uid: user.uid,
          nickname: userNickname,
          photoURL: userPhotoURL,
        },
      },
    };

    try {
      const sessionRef = ref(database, `sessions/${generatedSessionCode}`);
      await set(sessionRef, newSession);
      setSessionCode(generatedSessionCode);
      toast.success("Sessão criada com sucesso!");
      navigate(`/watchsession/${generatedSessionCode}`);
    } catch (error) {
      toast.error("Erro ao criar a sessão. Tente novamente.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return {
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
    handleSubmit,
    loadingSubmit,
  };
};
