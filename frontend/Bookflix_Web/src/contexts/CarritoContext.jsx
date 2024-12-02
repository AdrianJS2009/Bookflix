import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const [sincronizando, setSincronizando] = useState(false); // Control de sincronización

  useEffect(() => {
    if (auth.token) {
      sincronizarCarrito();
    }
  }, [auth.token]); // Solo depende del token

  useEffect(() => {
    if (!auth.token) {
      localStorage.setItem("carrito", JSON.stringify(items));
    }
  }, [items]); // Solo guarda en localStorage si no hay token

  const sincronizarCarrito = async () => {
    if (!auth.token || sincronizando) return; // Evitar múltiples sincronizaciones simultáneas
    setSincronizando(true);

    try {
      const carritoLocal = localStorage.getItem("carrito");
      const itemsLocales = carritoLocal ? JSON.parse(carritoLocal) : [];
      console.log("Contenido del carrito local:", itemsLocales);

      if (itemsLocales.length > 0) {
        const datosSincronizar = itemsLocales
          .filter((item) => item.idLibro && item.cantidad)
          .map((item) => ({
            LibroId: item.idLibro,
            Cantidad: item.cantidad,
          }));

        if (datosSincronizar.length > 0) {
          const response = await fetch(
            "https://localhost:7182/api/Carrito/Sincronizar",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
              },
              body: JSON.stringify(datosSincronizar),
            }
          );

          if (!response.ok) {
            throw new Error("Error al sincronizar productos locales.");
          }
          toast.success("Productos locales sincronizados con tu cuenta.");
          localStorage.removeItem("carrito");
        }
      }

      const response = await fetch(
        "https://localhost:7182/api/Carrito/ListarCarrito",
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo obtener el carrito del servidor.");
      }

      const data = await response.json();
      const itemsCarrito = Array.isArray(data?.items)
        ? data.items.map((item) => ({
            libroId: item.libroId,
            nombre: item.nombreLibro || "Sin nombre",
            cantidad: item.cantidad || 1,
            precio: item.precio || 0,
            urlImagen: item.urlImagen || "placeholder.jpg",
          }))
        : [];
      setItems(itemsCarrito);
    } catch (error) {
      console.error("Error al sincronizar el carrito:", error);
      toast.error("Error al sincronizar el carrito.");
    } finally {
      setSincronizando(false); // Liberar el bloqueo al finalizar
    }
  };

  const agregarProductoCarrito = async (producto, cantidad) => {
    if (!producto || !cantidad) {
      console.error(
        "Producto o cantidad no definidos en agregarProductoCarrito.",
        {
          producto,
          cantidad,
        }
      );
      return;
    }

    if (!auth.token) {
      const itemExistente = items.find(
        (item) => item.idLibro === producto.idLibro
      );
      const itemsActualizados = itemExistente
        ? items.map((item) =>
            item.idLibro === producto.idLibro
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          )
        : [...items, { ...producto, cantidad }];
      setItems(itemsActualizados);
      localStorage.setItem("carrito", JSON.stringify(itemsActualizados));
      toast.success("Producto añadido al carrito local.");
      return;
    }

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
            LibroId: producto.idLibro,
            Cantidad: cantidad,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al agregar producto al carrito en el backend.");
      }
      toast.success("Producto añadido al carrito.");
      await sincronizarCarrito();
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      toast.error("Error al agregar el producto al carrito.");
    }
  };

  const eliminarProductoCarrito = async (productoId) => {
    if (!productoId) {
      console.error("ID de producto no definido al intentar eliminar.");
      return;
    }

    if (!auth.token) {
      const itemsActualizados = items.filter(
        (item) => item.idLibro !== productoId
      );
      setItems(itemsActualizados);
      localStorage.setItem("carrito", JSON.stringify(itemsActualizados));
      toast.success("Producto eliminado del carrito local.");
      return;
    }

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
        throw new Error(
          "Error al eliminar el producto del carrito en el servidor."
        );
      }

      setItems((prevItems) =>
        prevItems.filter((item) => item.idLibro !== productoId)
      );
      toast.success("Producto eliminado del carrito.");
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      toast.error("Error al eliminar el producto del carrito.");
    }
  };

  const vaciarCarritoCompleto = async () => {
    if (!auth.token) {
      setItems([]);
      localStorage.removeItem("carrito");
      toast.success("Carrito local vaciado.");
      return;
    }

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
      toast.success("Carrito vaciado.");
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      toast.error("Error al vaciar el carrito.");
    }
  };

  const actualizarCantidadProducto = async (libroId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    if (!auth.token) {
      const itemsActualizados = items.map((item) =>
        item.idLibro === libroId ? { ...item, cantidad: nuevaCantidad } : item
      );
      setItems(itemsActualizados);
      localStorage.setItem("carrito", JSON.stringify(itemsActualizados));
      return;
    }

    try {
      const response = await fetch(
        "https://localhost:7182/api/Carrito/ActualizarCantidad",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({
            LibroId: libroId,
            NuevaCantidad: nuevaCantidad,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error desconocido al actualizar la cantidad.");
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.idLibro === libroId ? { ...item, cantidad: nuevaCantidad } : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      toast.error("Error al actualizar la cantidad.");
    }
  };

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarProductoCarrito,
        eliminarProductoCarrito,
        vaciarCarritoCompleto,
        actualizarCantidadProducto,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
