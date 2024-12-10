import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext/AuthContext";
import RenderRoutes from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import "./styles/Global.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <RenderRoutes />
          <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
