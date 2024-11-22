import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const CarritoContext = createContext();

export const useCarrito = () => {
  return useContext(CarritoContext);
};

export const CarritoProvider = ({ children }) => {
  const { auth } = useAuth();
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("carrito");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    if (auth.token) {
      const sincronizarCarrito = async () => {
        try {
          const response = await fetch("https://localhost:7182/api/Carrito", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          if (!response.ok) {
            throw new Error("No se pudo sincronizar con el servidor.");
          }
          const data = await response.json();
          setItems(data);
        } catch (error) {
          console.error("Error al sincronizar el carrito:", error);
        }
      };
      sincronizarCarrito();
    } else {
      // Guardar en localStorage si no hay token
      localStorage.setItem("carrito", JSON.stringify(items));
    }
  }, [items, auth.token]);

  const agregarAlCarrito = async (producto) => {
    if (auth.token) {
      try {
        const payload = {
          LibroId: producto.libroId,
          Cantidad: producto.cantidad,
        };

        const response = await fetch(
          "https://localhost:7182/api/Carrito/agregar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo sincronizar con el servidor.");
        }

        // Actualiza el carrito localmente
        setItems((prevItems) => [...prevItems, producto]);
      } catch (error) {
        console.error("Error al sincronizar el carrito:", error);
      }
    } else {
      // Si no hay token, guarda en localStorage
      setItems((prevItems) => {
        const newItems = [...prevItems, producto];
        localStorage.setItem("carrito", JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  return (
    <CarritoContext.Provider value={{ items, agregarAlCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};
