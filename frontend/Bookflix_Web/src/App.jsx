import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Catalogo from "./pages/Catalogo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductoDetalle from "./pages/ProductoDetalle";
import Registro from "./pages/Registro";
import SobreNosotros from "./pages/SobreNosotros";
import Carrito from "./pages/Carrito";
import { AuthProvider } from "./utils/AuthContext";

import "./styles/default.css";

function App() {
  return (
    <BrowserRouter>
      {" "}
      {/* Coloca el AuthProvider dentro de BrowserRouter */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="sobre-nosotros" element={<SobreNosotros />} />
            <Route path="producto/:id" element={<ProductoDetalle />} />
            <Route path="carrito" element={<Carrito />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
