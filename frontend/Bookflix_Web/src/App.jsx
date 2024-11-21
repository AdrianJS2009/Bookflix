import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Carrito from "./pages/Carrito";
import Catalogo from "./pages/Catalogo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductoDetalle from "./pages/ProductoDetalle";
import Registro from "./pages/Registro";
import SobreNosotros from "./pages/SobreNosotros";

import { AuthProvider } from "./contexts/AuthContext";
import { CarritoProvider } from "./contexts/CarritoContext";

import "./styles/default.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            </Routes>
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
    );
}

export default App;
