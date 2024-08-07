import { createContext, useState, useEffect } from "react";
import { auth } from "../../services/firebaseConfig/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const adminStatus = currentUser.email === adminEmail;
        setIsAdmin(adminStatus);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
