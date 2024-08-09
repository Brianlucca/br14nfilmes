import React from "react";
import { AuthProvider } from "./contexts/authContext/AuthContext";
import RenderRoutes from "./routes/Routes";
import { ToastContainer } from 'react-toastify';
import './styles/Global.css'
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <AuthProvider>
      <RenderRoutes />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
