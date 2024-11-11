import { NavLink } from "react-router-dom";
import classes from "./styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={`fondo-negro ${classes.footer}`}>
      <div className={classes.containerImg}>
        <img
          src="/assets/logos/Logo - Blanco.png"
          className={classes.logoFooter}
          alt="Bookflix logo"
        />
      </div>
      <ul className={`texto-blanco texto-pequeño ${classes.listaFooter}`}>
        <li>
          <NavLink to="/sobre-nosotros" activeClassName="active">
            Sobre nosotros
          </NavLink>
        </li>
        <li>
          <NavLink to="/metodos-de-pago" activeClassName="active">
            Métodos de pago
          </NavLink>
        </li>
        <li>
          <NavLink to="/ayuda" activeClassName="active">
            Ayuda
          </NavLink>
        </li>
        <li>
          <NavLink to="/contacto" activeClassName="active">
            Contacto
          </NavLink>
        </li>
        <li>
          <NavLink to="/terminos-y-condiciones" activeClassName="active">
            T&C
          </NavLink>
        </li>
        <li>
          <NavLink to="/politica-de-privacidad" activeClassName="active">
            Política de privacidad
          </NavLink>
        </li>
        <li>
          <NavLink to="/cookies" activeClassName="active">
            Cookies
          </NavLink>
        </li>
        <li>
          <NavLink to="/politica-de-devoluciones" activeClassName="active">
            Política de devoluciones
          </NavLink>
        </li>
      </ul>
      <p className="texto-blanco texto-pequeño">© 2024 BOOKFLIX</p>
    </footer>
  );
};

export default Footer;
