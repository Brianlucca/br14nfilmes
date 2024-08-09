import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import { database } from "../../../services/firebaseConfig/FirebaseConfig";

const AdminCommentsList = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const commentsRef = ref(database, `movies`);
    onValue(commentsRef, (snapshot) => {
      const moviesData = snapshot.val();
      const allComments = [];

      if (moviesData) {
        Object.entries(moviesData).forEach(([movieId, movieData]) => {
          if (movieData.comments) {
            Object.entries(movieData.comments).forEach(([commentId, comment]) => {
              allComments.push({ movieId, commentId, ...comment });
            });
          }
        });
      }

      setComments(allComments);
    });
  }, []);

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comentários</h2>
      <div className="max-h-lvh overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.commentId} className="p-4 bg-gray-50 rounded-lg shadow-md">
              <p className="text-gray-800">
                <strong>{comment.userName}:</strong> {comment.text}
              </p>
              <p className="text-sm text-gray-600">
                Filme: 
                <Link 
                  to={`/movie/${comment.movieId}`} 
                  className="text-blue-500 hover:underline ml-1"
                >
                  {comment.movieId}
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Respondendo a: {comment.replyingToName || "N/A"}
              </p>
            </div>
          ))
        ) : (
          <p>Nenhum comentário encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default AdminCommentsList;
