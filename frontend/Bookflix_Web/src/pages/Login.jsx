import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import "../styles/default.css";
import "../styles/form.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { iniciarSesion, setAuthenticated } = useAuth();

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await iniciarSesion(email, password);
      toast.success("¡Bienvenido a Bookflix!");
      setAuthenticated(true);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <>
      <main className="form-container">
        <h1 className="texto-grande">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="form texto-mediano">
          <div className="campo-formulario">
            <label className="text-form" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              placeholder="Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="campo-formulario">
            <label className="text-form" htmlFor="password">
              Contraseña
            </label>
            <input
              placeholder="Contraseña"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button label="Entrar" type="submit" styleType="btnDefault" />
        </form>
        <NavLink to="/registro" className="texto-pequeño">
          ¿Aún no tienes cuenta? Regístrate
        </NavLink>
      </main>
    </>
  );
}
