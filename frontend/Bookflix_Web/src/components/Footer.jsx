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
          <a href="#">Métodos de pago</a>
        </li>
        <li>
          <a href="#">Tarjetas de regalo</a>
        </li>
        <li>
          <a href="#">Ayuda</a>
        </li>
        <li>
          <a href="#">Contacto</a>
        </li>
        <li>
          <a href="#">T&C</a>
        </li>
        <li>
          <a href="#">Política de privacidad</a>
        </li>
        <li>
          <a href="#">Cookies</a>
        </li>
        <li>
          <a href="#">Política de devoluciones</a>
        </li>
      </ul>
      <p className="texto-blanco texto-pequeño">© 2024 BOOKFLIX</p>
    </footer>
  );
};

export default Footer;
