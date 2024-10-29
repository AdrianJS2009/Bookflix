import styles from "../styles/TopVentas.module.css";

export default function TopVentas() {
  return (
    <section id="top-ventas" className={styles.topVentasSection}>
      <div className={styles.libro}>
        <img
          src="/assets/libros/1.png"
          className={styles.libroImagen}
          alt="Libro 1"
        />
        <img
          src="/assets/numeros/1.png"
          className={styles.puestoImagen}
          alt="Puesto 1"
        />
      </div>
      <div className={styles.libro}>
        <img
          src="/assets/libros/2.png"
          className={styles.libroImagen}
          alt="Libro 2"
        />
        <img
          src="/assets/numeros/2.png"
          className={styles.puestoImagen}
          alt="Puesto 2"
        />
      </div>
      <div className={styles.libro}>
        <img
          src="/assets/libros/3.png"
          className={styles.libroImagen}
          alt="Libro 3"
        />
        <img
          src="/assets/numeros/3.png"
          className={styles.puestoImagen}
          alt="Puesto 3"
        />
      </div>
    </section>
  );
}
