import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import classes from "./styles/Header.module.css";

const Header = () => {
  const [userName, setUsername] = useState("Usuario");
  const { productos } = useSelector((state) => state.carrito);
  const cartCount = productos.reduce((total, item) => total + item.cantidad, 0); // Calculate total item count

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(
          `Hola, ${decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]}`
        );
      } catch (error) {
        console.error("Error decodificando el token:", error);
        setUsername("Invitado");
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
            Cesta <span className="cart-count">({cartCount})</span>
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
