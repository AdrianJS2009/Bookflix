import React from "react";
import { NavLink } from "react-router-dom";

import classes from "./styles/Header.module.css";

const Header = () => {
  return (
    <header className={`${classes.header} fondo-negro`}>
      <div className={classes.navLogo}>
        <NavLink to="/">
          <img
            src="/assets/logos/Logo-degradado-con bisel.png"
            className={classes.logoNavbar}
            alt="Bookflix logo"
          />
        </NavLink>
        <div className={`${classes.userCart} texto-pequeño-bold`}>
          <NavLink to="/login">
            <img
              src="/assets/iconos/Logo Usuario.png"
              className={classes.iconos}
              alt="Iconos"
            />{" "}
            Usuario
          </NavLink>
          <NavLink to="/carrito">
            <img
              src="/assets/iconos/Logo Cesta.png"
              className={classes.iconos}
              alt="Iconos"
            />{" "}
            Cesta
          </NavLink>
        </div>
      </div>
      <nav className={`${classes.navPrincipal} fondo-verde`}>
        <ul className="texto-pequeño-bold texto-negro">
          <li>
            <NavLink to="/#novedades" activeClassName="active-link">Novedades</NavLink>
          </li>
          <li>
            <NavLink to="/#generos" activeClassName="active-link">Géneros</NavLink>
          </li>
          <li>
            <NavLink to="/#top-ventas" activeClassName="active-link">Top ventas</NavLink>
          </li>
          <li>
            <NavLink to="/bundles" activeClassName="active-link">Bundles</NavLink>
          </li>
          <li>
            <NavLink to="/catalogo" activeClassName="active-link">Catálogo</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
