import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import classes from "./styles/Header.module.css";

const Header = () => {
  const [userName, setUsername] = useState("Usuario");
  const carritoItems = useSelector((state) => state.carrito.items || []); // Ensure carritoItems is at least an empty array

  const cartCount = carritoItems.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUsername(
          `Hola, ${decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]}`
        );
      } catch (error) {
        console.error("Error decodificando el token:", error);
        setUsername("Usuario");
      }
    }
  }, []);

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
              alt="Icono Usuario"
            />
            {userName}
          </NavLink>
          <NavLink to="/carrito">
            <img
              src="/assets/iconos/Logo Cesta.png"
              className={classes.iconos}
              alt="Icono Cesta"
            />
            <span className={classes.cartCount}>{cartCount}</span>
            Cesta 
          </NavLink>
        </div>
      </div>
      <nav className={`${classes.navPrincipal} fondo-verde`}>
        <ul className="texto-pequeño-bold texto-negro">
          <li>
            <a href="#novedades">Novedades</a>
          </li>
          <li>
            <a href="#generos">Géneros</a>
          </li>
          <li>
            <a href="#top-ventas">Top ventas</a>
          </li>
          <li>
            <NavLink to="/bundles" activeClassName="active-link">
              Bundles
            </NavLink>
          </li>
          <li>
            <NavLink to="/catalogo" activeClassName="active-link">
              Catálogo
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
