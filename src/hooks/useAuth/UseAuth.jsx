import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext/AuthContext"; 

export const useAuth = () => useContext(AuthContext);
