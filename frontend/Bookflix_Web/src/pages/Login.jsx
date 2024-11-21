import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { iniciarSesion } from "../redux/slices/authSlice";
import "../styles/form.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7182/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas.");
      }

      const data = await response.json();
      dispatch(iniciarSesion({ usuario: { email }, token: data.token }));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="login-container texto-mediano">
        <h1 className="texto-grande">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="formulario">
          {error && <p className="error">{error}</p>}
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btnLogin">
            Ingresar
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
