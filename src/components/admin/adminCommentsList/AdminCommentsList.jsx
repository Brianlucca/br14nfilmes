import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import { database } from "../../../services/firebaseConfig/FirebaseConfig";

const AdminCommentsList = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const allComments = [];

      const types = ['movies', 'musics', 'animes', 'series'];

      for (const type of types) {
        const commentsRef = ref(database, type);
        await new Promise((resolve) => {
          onValue(commentsRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
              Object.entries(data).forEach(([itemId, itemData]) => {
                if (itemData.comments) {
                  Object.entries(itemData.comments).forEach(([commentId, comment]) => {
                    allComments.push({ type, itemId, commentId, ...comment });
                  });
                }
              });
            }

            resolve();
          });
        });
      }

      setComments(allComments);
    };

    fetchComments();
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
                {comment.type === 'movies' && 'Filme:'}
                {comment.type === 'musics' && 'Música:'}
                {comment.type === 'animes' && 'Anime:'}
                {comment.type === 'series' && 'Série:'}
                <Link 
                  to={`/${comment.type.slice(0, -1)}/${comment.itemId}`} 
                  className="text-blue-500 hover:underline ml-1"
                >
                  {comment.itemId}
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
