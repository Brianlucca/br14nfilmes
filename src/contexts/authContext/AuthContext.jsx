import { onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../services/firebaseConfig/FirebaseConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
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
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
