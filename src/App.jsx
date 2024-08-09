import React from "react";
import { AuthProvider } from "./contexts/authContext/AuthContext";
import RenderRoutes from "./routes/Routes";
import './styles/Global.css'
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <AuthProvider>
      <RenderRoutes />
    </AuthProvider>
  );
}

export default App;
