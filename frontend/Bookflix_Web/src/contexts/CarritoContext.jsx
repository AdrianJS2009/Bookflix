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
          const response = await fetch(
            "https://localhost:7182/api/Carrito/ListarCarrito",
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          );
          if (!response.ok)
            throw new Error("No se pudo sincronizar con el servidor.");

          const data = await response.json();
          const carritoItems = Array.isArray(data?.items)
            ? data.items.map((item) => ({
                libroId: item.libroId,
                nombre: item.nombre || "Sin nombre",
                cantidad: item.cantidad || 1,
                precio: item.precio || 0,
                urlImagen: item.urlImagen || "placeholder.jpg",
              }))
            : [];
          setItems(carritoItems);
        } catch (error) {
          console.error("Error al sincronizar el carrito:", error);
        }
      };
      sincronizarCarrito();
    } else {
      localStorage.setItem("carrito", JSON.stringify(items));
    }
  }, [auth.token]);

  const agregarAlCarrito = (producto, cantidad) => {
    const productoConDatosCompletos = {
      libroId: producto.idLibro,
      cantidad,
      nombre: producto.nombre,
      precio: producto.precio,
      urlImagen: producto.urlImagen,
      subtotal: producto.precio * cantidad,
    };

    console.log("Producto con datos completos:", productoConDatosCompletos);

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.libroId === productoConDatosCompletos.libroId
      );
      let newItems;

      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.libroId === productoConDatosCompletos.libroId
            ? {
                ...item,
                cantidad: item.cantidad + productoConDatosCompletos.cantidad,
              }
            : item
        );
      } else {
        newItems = [...prevItems, productoConDatosCompletos];
      }

      // Guarda los cambios en localStorage
      localStorage.setItem("carrito", JSON.stringify(newItems));

      return newItems;
    });

    alert(
      `${productoConDatosCompletos.cantidad} unidad(es) de "${productoConDatosCompletos.nombre}" añadida(s) al carrito.`
    );

    if (auth.token) {
      try {
        const payload = {
          LibroId: productoConDatosCompletos.libroId,
          Cantidad: productoConDatosCompletos.cantidad,
        };

        const response = fetch("https://localhost:7182/api/Carrito/agregar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Error al sincronizar con el servidor.");
        }
      } catch (error) {
        console.error("Error al agregar producto al carrito remoto:", error);
      }
    }
  };

  const eliminarItem = async (productoId) => {
    if (auth.token) {
      try {
        const response = await fetch(
          `https://localhost:7182/api/Carrito/eliminar/${productoId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo eliminar el producto del servidor.");
        }

        // Actualización del carro local
        setItems((prevItems) => {
          const newItems = prevItems.filter(
            (item) => item.libroId !== productoId
          );
          localStorage.setItem("carrito", JSON.stringify(newItems));
          return newItems;
        });
      } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
      }
    } else {
      setItems((prevItems) => {
        const newItems = prevItems.filter(
          (item) => item.libroId !== productoId
        );
        localStorage.setItem("carrito", JSON.stringify(newItems));
        return newItems;
      });
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
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo vaciar el carrito en el servidor.");
        }
        setItems([]);
        localStorage.removeItem("carrito");
      } catch (error) {
        console.error("Error al vaciar el carrito:", error);
      }
    } else {
      // Si no hay token, vacía el localStorage
      setItems([]);
      localStorage.removeItem("carrito");
    }
  };

  return (
    <CarritoContext.Provider
      value={{ items, agregarAlCarrito, eliminarItem, vaciarCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
