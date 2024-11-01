import Header from "../components/Header";
import Footer from "../components/Footer";

import styles from "../styles/catalogo.css"


export default function Catalogo() {
    return (
        <>
            <Header />
            
            <div className={styles.catalogoBookflix}>
                <h1>Catálogo</h1>
                <div className={styles.catalogo}>
                    <div className={styles.catalogoFiltro}>

                    </div>
                    <div className={styles.catalogoItems}>
                        <div className={styles.catalogoItem}>
                            <div className={styles.catalogoItemContent}>

                            </div>
                            <div className={styles.catalogoItemButtons}>
                                <Button label="Comprar" styleType="btnComprar" onClick={() => alert("Compra realizada")} />
                                <Button label="Añadir a la cesta" styleType="btnAñadir" onClick={() => alert("Añadido a la cesta")} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
