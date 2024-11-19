import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Carrito from "./pages/Carrito";
import Catalogo from "./pages/Catalogo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductoDetalle from "./pages/ProductoDetalle";
import Registro from "./pages/Registro";
import SobreNosotros from "./pages/SobreNosotros";
import store from "./redux/store";
import { AuthProvider } from "./utils/AuthContext";

import "./styles/default.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="registro" element={<Registro />} />
              <Route path="catalogo" element={<Catalogo />} />
              <Route
                path="producto/:productoId"
                element={<ProductoDetalle />}
              />
              <Route path="sobre-nosotros" element={<SobreNosotros />} />
              <Route path="carrito" element={<Carrito />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
