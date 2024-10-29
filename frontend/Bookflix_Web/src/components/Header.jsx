import { Link } from "react-router-dom";
import styles from "../styles/header.module.css";

const Header = () => {
  return (
    <header className={`${styles.header} ${styles.fondoNegro}`}>
      <div className={styles.navLogo}>
        <Link to="/">
          <img
            src="/assets/logos/Logo-degradado-con bisel.png"
            className={styles.logoNavbar}
            alt="Bookflix logo"
          />
        </Link>
        <div className={styles.userCart}>
          <Link to="/login" className={styles.userCartLink}>
            <img
              src="/assets/iconos/Logo Usuario.png"
              className={styles.iconos}
              alt=""
            />{" "}
            Usuario
          </Link>
          <Link to="/carrito" className={styles.userCartLink}>
            <img
              src="/assets/iconos/Logo Cesta.png"
              className={styles.iconos}
              alt=""
            />{" "}
            Cesta
          </Link>
        </div>
      </div>
      <nav className={`${styles.navPrincipal} ${styles.fondoVerde}`}>
        <ul
          className={`${styles.navLinks} ${styles.textoPequeñoBold} ${styles.textoNegro}`}
        >
          <li className={styles.navItem}>
            <a href="/#novedades">Novedades</a>
          </li>
          <li className={styles.navItem}>
            <a href="/#generos">Géneros</a>
          </li>
          <li className={styles.navItem}>
            <a href="/#top-ventas">Top ventas</a>
          </li>
          <li className={styles.navItem}>
            <Link to="/bundles">Bundles</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/catalogo">Catálogo</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
