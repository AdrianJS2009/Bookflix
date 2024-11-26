import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import classes from "./styles/Header.module.css";

const Header = () => {
  const [userName, setUserName] = useState("Usuario");
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useCarrito();
  const { auth, cerrarSesion } = useAuth();

  const cartCount = Array.isArray(items)
    ? items.reduce((total, item) => total + item.cantidad, 0)
    : 0;

  useEffect(() => {
    if (auth.token) {
      try {
        const decoded = JSON.parse(atob(auth.token.split(".")[1])); // Decodificar el token JWT
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

  const toggleModal = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    cerrarSesion();
    setMenuOpen(false);
    window.location.reload(); 
  };
  

  return (
    <>
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
            {auth.usuario ? (
              <button onClick={toggleModal} className={classes.userButton}>
                <img
                  src="/assets/iconos/Logo Usuario.png"
                  className={classes.iconos}
                  alt="Icono Usuario"
                />
                {userName}
              </button>
            ) : (
              <NavLink to="/login">
                <img
                  src="/assets/iconos/Logo Usuario.png"
                  className={classes.iconos}
                  alt="Icono Usuario"
                />
                {userName}
              </NavLink>
            )}
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
      {menuOpen && (
        <div className={`${classes.modalOverlay} texto-pequeño`}  onClick={toggleModal}>
          <div
            className={classes.modalContent}
            onClick={(e) => e.stopPropagation()} // Evitar cerrar el modal al hacer clic dentro
          >
            <h2 className="texto-mediano-bold">Opciones de usuario</h2>
            <div className={classes.modalActions}>
              <NavLink to="/perfil" activeClassName="active-link">Perfil & Pedidos</NavLink>
              <button onClick={handleLogout}>Cerrar sesión</button>
              <button onClick={toggleModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
