import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Catalogo from "./pages/Catalogo";
import Catalogo2 from "./pages/Catalogo2";
import SobreNosotros from "./pages/SobreNosotros";
import Layout from "./components/Layout"; // Nuevo componente para el layout

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
          <Route path="catalogo2" element={<Catalogo2 />} />
          <Route path="sobre-nosotros" element={<SobreNosotros />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;