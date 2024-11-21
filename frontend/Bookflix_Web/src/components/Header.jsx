import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import classes from "./styles/Header.module.css";

const Header = () => {
  const [userName, setUserName] = useState("Usuario");
  const { items } = useCarrito(); // Usar CarritoContext para obtener los ítems del carrito
  const { auth } = useAuth(); // Usar AuthContext para manejar el estado del usuario

  const cartCount = items.reduce((total, item) => total + item.cantidad, 0); // Calcular la cantidad total en el carrito

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserName(
          `Hola, ${decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]}`
        );
      } catch (error) {
        console.error("Error decodificando el token:", error);
        setUserName("Usuario");
      }
    } else if (auth.usuario) {
      setUserName(`Hola, ${auth.usuario.Nombre || "Usuario"}`);
    }
  }, [auth]);

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
