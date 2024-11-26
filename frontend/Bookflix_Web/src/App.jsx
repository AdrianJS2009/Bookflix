import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CarritoProvider } from "./contexts/CarritoContext";
import LayoutGeneral from "./components/LayoutHeaderFooter";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import ProductoDetalle from "./pages/ProductoDetalle";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Carrito from "./pages/Carrito";
import SobreNosotros from "./pages/SobreNosotros";
import ConfirmacionCompra from "./pages/ConfirmacionCompra";

import "./styles/default.css";

function App() {
  return (
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
              <Route path="confirmacion-compra" element={<ConfirmacionCompra />} />
            </Route>
          </Routes>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;