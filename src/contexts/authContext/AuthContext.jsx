import { onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../services/firebaseConfig/FirebaseConfig";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        await currentUser.reload();
        if (!currentUser.emailVerified) {
          setUser(null);
          setIsAdmin(false);
          navigate("/verify-email");
          setLoading(false);
          return;
        }

        setUser(currentUser);
        const adminStatus = currentUser.email === adminEmail;
        setIsAdmin(adminStatus);

        const db = getDatabase();
        const userId = currentUser.uid;
        const userRef = ref(db, `users/${userId}`);

        try {
          const snapshot = await get(userRef);

          if (!snapshot.exists()) {
            const defaultNickname = "Usuario AinzOoal";
            const role = adminStatus ? "admin" : "user";
            await set(userRef, {
              role: role,
              nickname: defaultNickname,
            });
          } else {
            const userData = snapshot.val();
            setUser((prevUser) => ({
              ...prevUser,
              nickname: userData.nickname,
              role: userData.role,
            }));
          }
        } catch (error) {
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
