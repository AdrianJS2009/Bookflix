import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const { auth } = useAuth(); // Acceder al estado de autenticación
  const [items, setItems] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const carritoLocal = JSON.parse(localStorage.getItem("carrito")) || [];
    setItems(carritoLocal);
  }, []);

  // Guardar carrito en localStorage al cambiar
  useEffect(() => {
    if (!auth.token) {
      localStorage.setItem("carrito", JSON.stringify(items));
    }
  }, [items, auth.token]);

  const agregarAlCarrito = async (producto) => {
    if (auth.token) {
      // Usuario logeado: sincronizar con el backend
      try {
        const response = await fetch(
          "https://localhost:7182/api/Carrito/agregar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({ productoId: producto.id, cantidad: 1 }),
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo sincronizar con el servidor.");
        }

        const updatedItems = await response.json();
        setItems(updatedItems); // Actualizar el estado con los datos del servidor
      } catch (error) {
        console.error("Error al sincronizar el carrito:", error);
      }
    } else {
      // Usuario no logeado: agregar al carrito local
      setItems((prevItems) => [...prevItems, producto]);
    }
  };

  const vaciarCarrito = async () => {
    if (auth.token) {
      // Usuario logeado: sincronizar con el backend
      try {
        const response = await fetch(
          "https://localhost:7182/api/Carrito/vaciar",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo vaciar el carrito en el servidor.");
        }
      } catch (error) {
        console.error("Error al vaciar el carrito:", error);
      }
    }

    // Vaciar el carrito local
    setItems([]);
    if (!auth.token) {
      localStorage.removeItem("carrito");
    }
  };

  return (
    <CarritoContext.Provider value={{ items, agregarAlCarrito, vaciarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  return useContext(CarritoContext);
};
