import React from "react";
import { Link } from "react-router-dom";

import classes from  "./styles/Header.module.css";

const Header = () => {
  return (
    <header className={`${classes.header} fondo-negro`}>
      <div className={classes.navLogo}>
        <Link to="/">
          <img
            src="/assets/logos/Logo-degradado-con bisel.png"
            className={classes.logoNavbar}
            alt="Bookflix logo"
          />
        </Link>
        <div className={`${classes.userCart} texto-pequeño-bold`}>
          <Link to="/login">
            <img
              src="/assets/iconos/Logo Usuario.png"
              className={classes.iconos}
              alt=""
            />{" "}
            Usuario
          </Link>
          <Link to="/carrito">
            <img
              src="/assets/iconos/Logo Cesta.png"
              className={classes.iconos}
              alt=""
            />{" "}
            Cesta
          </Link>
        </div>
      </div>
      <nav className={`${classes.navPrincipal} fondo-verde`}>
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
