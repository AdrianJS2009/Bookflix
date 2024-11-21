import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/Home.css";

const Home = () => {
  return (
    <>
      <Header />
      <div className="home-container texto-mediano">
        <h1 className="texto-grande">¡Bienvenidos a Bookflix!</h1>
        <p>
          Explora nuestro catálogo de libros, revisa los detalles y añade tus
          favoritos al carrito.
        </p>
        <div className="acciones">
          <Link to="/catalogo" className="btnHome">
            Ver Catálogo
          </Link>
          <Link to="/registro" className="btnHome">
            Crear Cuenta
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
