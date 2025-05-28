import {
  Loader2,
  Reply,
  Send,
  Trash2,
  UserCircle,
  XCircle,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../contexts/authContext/AuthContext";

const MAX_COMMENT_CHARS = 250;

const CommentItem = ({
  comment,
  commentKey,
  onDeleteComment,
  onReply,
  currentUserId,
}) => {
  const canDelete = currentUserId === comment.userId;

  return (
    <div className="flex space-x-3 py-4 border-b border-gray-700/50 last:border-b-0">
      {comment.userPhotoURL ? (
        <img
          src={comment.userPhotoURL}
          alt={comment.userName}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0 mt-1"
        />
      ) : (
        <UserCircle
          size={36}
          className="text-gray-500 flex-shrink-0 mt-1 sm:w-10 sm:h-10 w-8 h-8"
        />
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-sm font-semibold text-sky-400 break-all">
            {comment.userName || "Usuário"}
          </p>
          {canDelete && (
            <button
              onClick={() => onDeleteComment(commentKey)}
              className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full ml-2 flex-shrink-0"
              aria-label="Excluir comentário"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        {comment.replyingToName && (
          <p className="text-xs text-gray-400 mb-1 italic">
            ↪ Respondendo a{" "}
            <span className="font-medium text-sky-500">
              {comment.replyingToName}
            </span>
          </p>
        )}
        <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
          {comment.text}
        </p>
        <div className="mt-2">
          <button
            onClick={() => onReply(commentKey, comment.userName)}
            className="text-xs text-gray-400 hover:text-sky-400 font-medium flex items-center transition-colors"
          >
            <Reply size={14} className="mr-1.5" />
            Responder
          </button>
        </div>
      </div>
    </div>
  );
};

const Comments = ({ comments, onCommentSubmit, onDeleteComment }) => {
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToName, setReplyingToName] = useState("");
  const { user, loading: authLoading } = useContext(AuthContext);
  const [charsLeft, setCharsLeft] = useState(MAX_COMMENT_CHARS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCharsLeft(MAX_COMMENT_CHARS - commentText.length);
  }, [commentText]);

  const handleCommentTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_COMMENT_CHARS) {
      setCommentText(text);
    } else {
      setCommentText(text.substring(0, MAX_COMMENT_CHARS));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (authLoading) {
      toast.info("Aguardando informações do perfil...");
      return;
    }

    if (!user || !user.uid) {
      toast.warn("Você precisa estar logado para comentar.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    setIsSubmitting(true);

    const userNickname = user.nickname;
    const userPhotoUrl = user.photoURL || null;
    const defaultNicknamePattern = `Usuário_${user.uid.substring(0, 5)}`;

    if (!userNickname || userNickname === defaultNicknamePattern) {
      toast.info("Por favor, defina um nickname no seu perfil para comentar.");
      navigate("/profile", {
        state: { from: location.pathname, needsNickname: true },
      });
      setIsSubmitting(false);
      return;
    }

    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      toast.error("O comentário não pode estar vazio.");
      setIsSubmitting(false);
      return;
    }
    if (trimmedComment.length > MAX_COMMENT_CHARS) {
      toast.error(
        `Seu comentário excede o limite de ${MAX_COMMENT_CHARS} caracteres.`,
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await onCommentSubmit(
        trimmedComment,
        replyingTo,
        user.uid,
        userNickname,
        userPhotoUrl,
      );
      setCommentText("");
      setReplyingTo(null);
      setReplyingToName("");
    } catch (submitError) {
      toast.error("Ocorreu um erro ao enviar seu comentário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId, userName) => {
    setReplyingTo(commentId);
    setReplyingToName(userName);
    document.getElementById("comment-textarea")?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyingToName("");
  };

  const getPlaceholderText = () => {
    if (authLoading) return "Carregando perfil...";
    if (!user) return "Faça login para comentar...";
    const nicknameFromContext = user.nickname;
    const defaultNicknamePattern = user.uid
      ? `Usuário_${user.uid.substring(0, 5)}`
      : "";
    if (
      !nicknameFromContext ||
      nicknameFromContext === defaultNicknamePattern
    ) {
      return "Defina um nickname no seu perfil para comentar...";
    }
    return "Escreva seu comentário...";
  };

  const isSubmitButtonDisabled = () => {
    if (authLoading || !user || !user.uid || isSubmitting) return true;
    const nicknameFromContext = user.nickname;
    const defaultNicknamePattern = user.uid
      ? `Usuário_${user.uid.substring(0, 5)}`
      : "";
    return (
      !commentText.trim() ||
      charsLeft < 0 ||
      !nicknameFromContext ||
      nicknameFromContext === defaultNicknamePattern
    );
  };

  const isTextareaDisabled = () => {
    if (authLoading || !user || !user.uid) return true;
    const nicknameFromContext = user.nickname;
    const defaultNicknamePattern = user.uid
      ? `Usuário_${user.uid.substring(0, 5)}`
      : "";
    return (
      !nicknameFromContext || nicknameFromContext === defaultNicknamePattern
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-[#16161a] shadow-xl rounded-xl my-10 border border-gray-800/50">
      <form onSubmit={handleSubmit} className="mb-8">
        {replyingTo && (
          <div className="mb-3 p-2.5 bg-sky-900/30 border border-sky-700/50 rounded-md text-sm text-sky-300 flex justify-between items-center">
            <span>
              Respondendo a:{" "}
              <strong className="font-semibold">{replyingToName}</strong>
            </span>
            <button
              type="button"
              onClick={cancelReply}
              className="text-sky-400 hover:text-sky-200 p-1 rounded-full hover:bg-sky-700/30"
              aria-label="Cancelar resposta"
            >
              <XCircle size={18} />
            </button>
          </div>
        )}
        <div className="relative">
          <textarea
            id="comment-textarea"
            className="w-full p-3.5 pr-16 bg-[#222228] text-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-500 resize-none border border-gray-700/80 custom-scrollbar-thin"
            placeholder={getPlaceholderText()}
            value={commentText}
            onChange={handleCommentTextChange}
            rows="4"
            disabled={isTextareaDisabled() || isSubmitting}
            maxLength={MAX_COMMENT_CHARS}
          />
          <div
            className={`absolute bottom-2.5 right-3.5 text-xs font-medium
            ${charsLeft < 0 ? "text-red-500" : charsLeft < MAX_COMMENT_CHARS * 0.1 ? "text-yellow-400" : "text-gray-400"}
          `}
          >
            {charsLeft}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitButtonDisabled() || isSubmitting}
          className="mt-4 w-full sm:w-auto px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="mr-2 animate-spin" />
          ) : (
            <Send size={18} className="mr-2" />
          )}
          {isSubmitting ? "Enviando..." : "Enviar Comentário"}
        </button>
      </form>

      <div className="space-y-1">
        {comments && comments.length > 0 ? (
          comments.map(([key, comment]) => (
            <CommentItem
              key={key}
              comment={comment}
              commentKey={key}
              onDeleteComment={onDeleteComment}
              onReply={handleReply}
              currentUserId={user?.uid}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
