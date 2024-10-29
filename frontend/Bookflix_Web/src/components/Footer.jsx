import styles from "../styles/footer.module.css";

const Footer = () => {
  return (
    <footer className={`${styles.footer} ${styles.fondoNegro}`}>
      <div className={styles.footerContent}>
        <img
          src="/assets/logos/Logo - Blanco.png"
          className={styles.logoFooter}
          alt="Bookflix logo"
        />
      </div>
      <ul
        className={`${styles.listaFooter} ${styles.textoBlanco} ${styles.textoPequeño}`}
      >
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
      <p
        className={`${styles.footerText} ${styles.textoBlanco} ${styles.textoPequeño}`}
      >
        © 2024 BOOKFLIX
      </p>
    </footer>
  );
};

export default Footer;
