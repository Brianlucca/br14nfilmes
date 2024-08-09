import { Trash } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authContext/AuthContext";

const CommentItem = ({ comment, commentKey, onDeleteComment, onReply }) => {
  const { isAdmin } = useContext(AuthContext);

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <div className="flex flex-col">
        {comment.replyingToName && (
          <p className="text-sm text-gray-600 mb-1">
            Respondeu a {comment.replyingToName}
          </p>
        )}
        <div className="flex flex-col">
          <p className="text-gray-800  overflow-wrap break-words">
            <strong>{comment.userName}:</strong> {comment.text}
          </p>
        </div>
        <div className="flex justify-between">
        <button 
          onClick={() => onReply(commentKey, comment.userName)}
          className="text-blue-500 text-sm font-semibold mt-3 self-start"
          >
          Responder
        </button>
          {isAdmin && (
            <button 
            onClick={() => onDeleteComment(commentKey)}
            className=" text-red-500"
            >
              <Trash  className="mt-3 w-5" />
            </button>
          )}
          </div>
      </div>
    </div>
  );
};

const Comments = ({ comments, onCommentSubmit, onDeleteComment }) => {
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToName, setReplyingToName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onCommentSubmit(commentText, replyingTo);
      setCommentText("");
      setReplyingTo(null);
      setReplyingToName("");
    }
  };

  const handleReply = (commentId, userName) => {
    setReplyingTo(commentId);
    setReplyingToName(userName);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg my-8 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Comentários</h2>
      <div className="space-y-4">
        {comments.map(([key, comment]) => (
          <CommentItem
            key={key}
            comment={comment}
            commentKey={key}
            onDeleteComment={onDeleteComment}
            onReply={handleReply}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-8">
        {replyingTo && (
          <p className="text-sm text-gray-600 mb-2">
            Respondendo a {replyingToName}...
            <button 
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-red-500 ml-2"
            >
              Cancelar
            </button>
          </p>
        )}
        <textarea
          className="w-full p-4 bg-gray-100 rounded-lg shadow-md"
          placeholder="Escreva seu comentário..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
        >
          Enviar Comentário
        </button>
      </form>
    </div>
  );
};

export default Comments;