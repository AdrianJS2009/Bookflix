import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/default.css";
import "../styles/header.css";

const Header = () => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = localStorage.getItem("token");
      
      if (storedToken) {
        setToken(storedToken);
        const response = await fetch("http://localhost:5000/api/user/info", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const data = await response.json();
        setUsername(data.username);
      }
      
    };

    fetchToken();
  }, []);

  return (
    <header className="header fondo-negro">
      <div className="nav-logo">
        <Link to="/">
          <img
            src="/assets/logos/Logo-degradado-con-bisel.png"
            className="logo-navbar"
            alt="Bookflix logo"
          />
        </Link>
        <div className="user-cart texto-pequeño-bold">
          {token ? (
            <Link to="/profile">
              <img
                src="/assets/iconos/Logo-Usuario.png"
                className="iconos"
                alt="User Icon"
              />{" "}
              Hola {username}
            </Link>
          ) : (
            <Link to="/login">
              <img
                src="/assets/iconos/Logo-Usuario.png"
                className="iconos"
                alt="User Icon"
              />{" "}
              Usuario
            </Link>
          )}
          
          <Link to="/carrito">
            <img
              src="/assets/iconos/Logo-Cesta.png"
              className="iconos"
              alt="Shopping Cart Icon"
            />{" "}
            Cesta
          </Link>
        </div>
      </div>
      <nav className="nav-principal fondo-verde">
        <ul className="texto-pequeño-bold texto-negro">
          <li>
            <a href="/#novedades">Novedades</a>
          </li>
          <li>
            <a href="/#generos">Géneros</a>
          </li>
          <li>
            <a href="/#top-ventas">Top ventas</a>
          </li>
          <li>
            <Link to="/bundles">Bundles</Link>
          </li>
          <li>
            <Link to="/catalogo">Catálogo</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
