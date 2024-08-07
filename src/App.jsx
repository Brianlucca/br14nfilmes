import React from "react";
import { AuthProvider } from "./contexts/authContext/AuthContext";
import RenderRoutes from "./routes/Routes";

function App() {
  return (
    <AuthProvider>
      <RenderRoutes />
    </AuthProvider>
  );
}

export default App;
