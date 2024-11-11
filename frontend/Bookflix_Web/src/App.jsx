import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Catalogo from "./pages/Catalogo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductoDetalle from "./pages/ProductoDetalle";
import Registro from "./pages/Registro";
import SobreNosotros from "./pages/SobreNosotros";

import "./styles/default.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="sobre-nosotros" element={<SobreNosotros />} />
          <Route path="producto/:id" element={<ProductoDetalle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
