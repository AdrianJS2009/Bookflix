import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutGeneral from "./components/LayoutHeaderFooter";
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
              <Route path="/" element={<LayoutGeneral />}>
                <Route index element={<Home />} />
                <Route path="catalogo" element={<Catalogo />} />
                <Route path="producto/:productoId" element={<ProductoDetalle />} />
                <Route path="login" element={<Login />} />
                <Route path="registro" element={<Registro />} />
                <Route path="carrito" element={<Carrito />} />
                <Route path="sobre-nosotros" element={<SobreNosotros />} />
              </Route>
              
              
            </Routes>
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
    );
}

export default App;
