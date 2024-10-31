import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import styles from "../styles/default.module.css";
import formStyles from "../styles/form.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: email,
        Password: password,
      }),
    });

    if (response.ok) {
      const token = await response.text();
      localStorage.setItem("token", token);
      navigate("/");
    } else {
      alert("Credenciales incorrectas");
    }
  };
  return (
    <>
      <Header />
      <div className={formStyles.formContainer}>
        <h1 className={styles.textoGrande}>Iniciar Sesión</h1>
        <form
          onSubmit={handleLogin}
          className={`${formStyles.form} ${styles.textoMediano}`}
        >
          <div className={formStyles.campoFormulario}>
            <label className={styles.textForm} htmlFor="email">
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
          <div className={formStyles.campoFormulario}>
            <label className={styles.textForm} htmlFor="password">
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
          <button type="submit">Entrar</button>
        </form>
        <Link to="/registro" className={styles.textoPequeño}>
          ¿Aún no tienes cuenta? Regístrate
        </Link>
      </div>
      <Footer />
    </>
  );
}
