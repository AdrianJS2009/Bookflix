import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

import "../styles/default.css";
import "../styles/catalogo.css";

function Catalogo() {
    return (
        <>
            <Header />
            
            <div className="catalogoBookflix">
                <h1>Catálogo</h1>
                <div className="catalogo">
                    <div className="catalogoFiltro">

                    </div>
                    <div className="catalogoItems">
                        <div className="catalogoItem">
                            <div className="catalogoItemContent">
                                <img src="/assets/libros/1.png" className="imgItemCatalogo" />
                                <p className="titulo">Señorita feliz</p>
                                <p className="precio">10,50 €</p>
                            </div>
                            <div className="catalogoItemButtons">
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

export default Catalogo;