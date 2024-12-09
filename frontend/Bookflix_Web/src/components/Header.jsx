import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import classes from "./styles/Header.module.css";

const Header = () => {
  const [userName, setUserName] = useState("Usuario");
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, vaciarCarritoLocal } = useCarrito();
  const { rol, auth, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const [itemsNav, setItemsNav] = useState(true);

  const cartCount = Array.isArray(items)
    ? items.reduce((total, item) => total + item.cantidad, 0)
    : 0;

  useEffect(() => {
    if (auth.token) {
      try {
        const decoded = JSON.parse(atob(auth.token.split(".")[1]));
        setUserName(
          `Hola, ${decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]}`
        );
      } catch (error) {
        console.error("Error decodificando el token:", error);
      }
    } else {
      setUserName("Usuario");
    }
  }, [auth]);

  const toggleModal = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("body-no-scroll");
    } else {
      document.body.classList.remove("body-no-scroll");
    }
    return () => {
      document.body.classList.remove("body-no-scroll");
    };
  }, [menuOpen]);

  const handleLogout = () => {
    cerrarSesion();
    setMenuOpen(false);
    vaciarCarritoLocal();
  };

  const handleAbrirPerfil = () => {
    setMenuOpen(false);
  };

  const handleNavigation = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleItemsNav = () => setItemsNav(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      if(itemsNav && window.innerWidth <= 768){
        setItemsNav(false);
      } else {
        setItemsNav(true);
      }
    };
 
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
            {auth.token ? (
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

            <label htmlFor="menuToggle" className={classes.hamburger} onClick={handleItemsNav}>
              <span></span>
              <span></span>
              <span></span>
            </label>
          </div>
        </div>

        {itemsNav && (
          <nav className={`${classes.navPrincipal} fondo-verde`}>
            <ul className="texto-pequeño-bold texto-negro">
              <li>
                <NavLink to="/" onClick={() => handleNavigation('novedades')}>Novedades</NavLink>
              </li>
              <li>
                <NavLink to="/" onClick={() => handleNavigation('generos')}>Géneros</NavLink>
              </li>
              <li>
                <NavLink to="/" onClick={() => handleNavigation('top-ventas')}>Top ventas</NavLink>
              </li>
              <li>
                <NavLink to="/catalogo">Catálogo</NavLink>
              </li>
            </ul>
          </nav>
        )}
      </header>


      {menuOpen && (
        <div className={`${classes.modalOverlay} texto-pequeño`} onClick={toggleModal}>
          <div
            className={classes.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="texto-mediano-bold">Opciones de usuario</h2>
            <div className={classes.modalActions}>
              <NavLink to="perfil" onClick={handleAbrirPerfil} activeClassName="active-link">Perfil & Pedidos</NavLink>
              {rol === "admin" ? (
                <NavLink to="admin">Admin</NavLink>
              ) : (
                <></>
              )}
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
