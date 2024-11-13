import { useEffect,useState } from "react";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/carrito.css";
import "../styles/default.css";

const Carrito = ({ carrito }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [precioTotal, setPrecioTotal] = useState(0);

    const fetchCarrito = async () => {
        setIsLoading(true);
        setError(null);

        try {
            let url = `http://localhost:5000/api/Libro/ListarLibros`
            
            const response = await fetch(url, {
                headers: {
                  Accept: "application/json",
                },
            });
            
            if (!response.ok) {
                throw new Error("Error al obtener libros desde el servidor");
            }
            const data = await response.json();
            setLibros(data.libros || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCarrito();
    }, [nombre, autor, cantidad, precio]);
    
    return (
        <>
            <Header />
            
            <div className="carrito-container texto-pequeño">
                {}
            </div>

            <Footer />
        </>
    );
}

export default Carrito;