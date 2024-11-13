import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Catalogo from "./pages/Catalogo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductoDetalle from "./pages/ProductoDetalle";
import Registro from "./pages/Registro";
import SobreNosotros from "./pages/SobreNosotros";
import { AuthProvider, useAuth } from "./utils/AuthContext"; // Asegúrate de importar AuthProvider y useAuth

import "./styles/default.css";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="sobre-nosotros" element={<SobreNosotros />} />
            <Route
              path="producto/:id"
              element={
                <PrivateRoute>
                  <ProductoDetalle />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
