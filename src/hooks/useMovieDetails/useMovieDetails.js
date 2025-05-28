import { get, off, onValue, push, ref, remove, set } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/authContext/AuthContext";
import { database } from "../../services/firebaseConfig/FirebaseConfig";

const useMovieDetails = (id) => {
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, loading: authLoading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieRef = ref(database, `movies/${id}`);
        const snapshot = await get(movieRef);
        if (snapshot.exists()) {
          setMovie(snapshot.val());
        } else {
          toast.error("Filme não encontrado");
        }
      } catch (error) {
        toast.error("Erro ao buscar detalhes do filme");
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const commentsRef = ref(database, `movies/${id}/comments`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val();
      if (commentsData) {
        setComments(Object.entries(commentsData));
      } else {
        setComments([]);
      }
    });

    return () => off(commentsRef, "value", unsubscribe);
  }, [id]);

  useEffect(() => {
    if (user && user.uid) {
      const favoritesRef = ref(
        database,
        `users/${user.uid}/favorites/movie/${id}`,
      );
      const unsubscribe = onValue(favoritesRef, (snapshot) => {
        setIsFavorite(snapshot.exists());
      });

      return () => off(favoritesRef, "value", unsubscribe);
    }
  }, [id, user]);

  const handleCommentSubmit = async (commentText, replyingTo) => {
    if (authLoading) {
      toast.info("Aguardando informações do perfil...");
      return;
    }
    if (!user || !user.uid) {
      toast.error("Você precisa estar logado para comentar.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const defaultNicknamePattern = `Usuário_${user.uid.substring(0, 5)}`;

    if (!user.nickname || user.nickname === defaultNicknamePattern) {
      toast.warn("Por favor, defina um nickname no seu perfil para comentar.");
      navigate("/profile", {
        state: { from: location.pathname, needsNickname: true },
      });
      return;
    }

    const comment = {
      text: commentText,
      userName: user.nickname,
      userId: user.uid,
      userPhotoURL: user.photoURL,
      createdAt: new Date().toISOString(),
      replyingToName: replyingTo
        ? comments.find(([key]) => key === replyingTo)?.[1]?.userName
        : null,
    };

    try {
      await push(ref(database, `movies/${id}/comments`), comment);
      toast.success("Comentário enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar comentário");
    }
  };

  const handleDeleteComment = async (commentKey) => {
    if (!user || !user.uid) {
      toast.error("Você precisa estar logado para deletar um comentário.");
      return;
    }
    try {
      await remove(ref(database, `movies/${id}/comments/${commentKey}`));
      toast.success("Comentário deletado com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar comentário");
    }
  };

  const toggleFavorite = async () => {
    if (authLoading) {
      toast.info("Aguardando informações do perfil...");
      return;
    }
    if (!user || !user.uid) {
      toast.error("Você precisa estar logado para adicionar aos favoritos");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const favoriteRef = ref(
      database,
      `users/${user.uid}/favorites/movie/${id}`,
    );

    try {
      if (isFavorite) {
        await remove(favoriteRef);
        toast.success("Filme removido dos favoritos");
        setIsFavorite(false);
      } else {
        await set(favoriteRef, {
          id,
          title: movie.name,
          imageUrl: movie.imageUrl,
          gif: movie.gif,
          addedAt: new Date().toISOString(),
        });
        toast.success("Filme adicionado aos favoritos");
        setIsFavorite(true);
      }
    } catch (error) {
      toast.error("Erro ao atualizar favoritos");
    }
  };

  return {
    movie,
    comments,
    isFavorite,
    handleCommentSubmit,
    handleDeleteComment,
    toggleFavorite,
  };
};

export default useMovieDetails;
