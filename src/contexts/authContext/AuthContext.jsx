import { onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../services/firebaseConfig/FirebaseConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Adicionado para gerenciamento de carregamento

  useEffect(() => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const adminStatus = currentUser.email === adminEmail;
        setIsAdmin(adminStatus);

        if (adminStatus) {
          const db = getDatabase();
          const userId = currentUser.uid;

          try {
            const snapshot = await get(ref(db, 'roles/' + userId));
            if (!snapshot.exists()) {
              await set(ref(db, 'roles/' + userId), 'admin');
              console.log('Papel de admin definido para o usuário:', userId);
            }
          } catch (error) {
            console.error('Erro ao verificar ou definir papel de admin:', error);
          }
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
