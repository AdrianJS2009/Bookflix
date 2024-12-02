import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutGeneral from "./components/LayoutHeaderFooter";
import { AuthProvider } from "./contexts/AuthContext";
import { CarritoProvider } from "./contexts/CarritoContext";
import Carrito from "./pages/Carrito";
import Catalogo from "./pages/Catalogo";
import ConfirmacionCompra from "./pages/ConfirmacionCompra";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductoDetalle from "./pages/ProductoDetalle";
import Registro from "./pages/Registro";
import SobreNosotros from "./pages/SobreNosotros";

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
              <Route
                path="producto/:productoId"
                element={<ProductoDetalle />}
              />
              <Route path="login" element={<Login />} />
              <Route path="registro" element={<Registro />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="sobre-nosotros" element={<SobreNosotros />} />
              <Route
                path="confirmacion-compra"
                element={<ConfirmacionCompra />}
              />

              {/* Rutas protegidas
              <Route element={<PrivateRoute />}>
                <Route
                  path="confirmacion-compra"
                  element={<ConfirmacionCompra />}
                />
              </Route> */}
            </Route>
          </Routes>
          <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="dark"
            transition={Slide}
          />
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
