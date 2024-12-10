import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext/AuthContext";
import RenderRoutes from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import "./styles/Global.css";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
            <RenderRoutes />
            <ToastContainer />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
