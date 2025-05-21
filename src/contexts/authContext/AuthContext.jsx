import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onValue, serverTimestamp, off } from "firebase/database";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../services/firebaseConfig/FirebaseConfig";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let dbListenerUnsubscribe = null;

    const authUnsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (dbListenerUnsubscribe) {
        dbListenerUnsubscribe(); 
        dbListenerUnsubscribe = null;
      }
      setLoading(true);

      if (currentUser) {
        try {
          await currentUser.reload();
        } catch (reloadError) {
          console.warn("Falha ao recarregar dados do usuário do Auth:", reloadError);
        }

        if (!currentUser.emailVerified) {
          setUser(null);
          // Só redireciona se não estiver já numa página de autenticação/verificação
          const currentPath = window.location.pathname;
          if (!["/verify-email", "/login", "/register", "/reset-password"].includes(currentPath)) {
            navigate("/verify-email");
          }
          setLoading(false);
          return; 
        }

        const db = getDatabase();
        const userDbRef = ref(db, `users/${currentUser.uid}`);

        dbListenerUnsubscribe = onValue(userDbRef, (snapshot) => {
          if (snapshot.exists()) {
            const userDataFromDb = snapshot.val();
            setUser({
              ...currentUser,
              nickname: userDataFromDb.nickname || `Usuário_${currentUser.uid.substring(0, 5)}`,
              role: userDataFromDb.role || "user",
              photoURL: userDataFromDb.photoURL || currentUser.photoURL || null,
              nicknameChangeCount: userDataFromDb.nicknameChangeCount || 0,
            });
          } else {
            const defaultNickname = `Usuário_${currentUser.uid.substring(0, 5)}`;
            const newUserProfileData = {
              email: currentUser.email,
              nickname: defaultNickname,
              nicknameChangeCount: 0,
              photoURL: currentUser.photoURL || null,
              role: "user",
              createdAt: currentUser.metadata.creationTime || serverTimestamp(),
              dbCreatedAt: serverTimestamp()
            };
            set(userDbRef, newUserProfileData)
              .then(() => {
                setUser({
                  ...currentUser,
                  nickname: defaultNickname,
                  role: "user",
                  photoURL: newUserProfileData.photoURL,
                  nicknameChangeCount: 0,
                });
              })
              .catch(dbError => {
                console.error("Erro ao criar perfil do usuário no DB:", dbError);
                setUser({ ...currentUser, nickname: defaultNickname, role: "user" });
              });
          }
          setLoading(false);
        }, (error) => {
          console.error("Erro ao escutar dados do usuário no DB:", error);
          setUser({ ...currentUser, nickname: `Usuário_${currentUser.uid.substring(0, 5)}`, role: "user" });
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (dbListenerUnsubscribe) {
        dbListenerUnsubscribe();
      }
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
