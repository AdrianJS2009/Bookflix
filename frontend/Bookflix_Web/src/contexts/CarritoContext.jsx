import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const { auth } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const carritoLocal = JSON.parse(localStorage.getItem("carrito")) || [];
    setItems(carritoLocal);
  }, []);

  useEffect(() => {
    if (!auth.token) {
      localStorage.setItem("carrito", JSON.stringify(items));
    }
  }, [items, auth.token]);

  const agregarAlCarrito = async (producto) => {
    if (auth.token) {
      try {
        const response = await fetch(
          "https://localhost:7182/api/Carrito/agregar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({
              LibroId: producto.id, // Propiedad esperada por el backend
              Cantidad: 1, // Cantidad fija como mínimo 1
            }),
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo sincronizar con el servidor.");
        }

        const updatedItems = await response.json();
        setItems(updatedItems);
      } catch (error) {
        console.error("Error al sincronizar el carrito:", error);
      }
    } else {
      setItems((prevItems) => [...prevItems, producto]);
    }
  };

  const vaciarCarrito = async () => {
    if (auth.token) {
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
