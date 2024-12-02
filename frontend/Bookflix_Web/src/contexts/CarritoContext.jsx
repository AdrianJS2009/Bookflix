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

  useEffect(() => {
    if (auth.token) {
      sincronizarCarrito();
    } else {
      localStorage.setItem("carrito", JSON.stringify(items));
    }
  }, [auth.token, items]);

  const sincronizarCarrito = async () => {
    if (!auth.token) {
      vaciarCarrito();
    }

    try {
      const localCarrito = localStorage.getItem("carrito");
      const localItems = localCarrito ? JSON.parse(localCarrito) : [];
      console.log("Contenido del carrito local:", localItems);

      if (localItems.length > 0) {
        // Validar y mapear correctamente los datos
        const payload = localItems
          .filter((item) => item.idLibro && item.cantidad) // Filtrar datos válidos
          .map((item) => ({
            LibroId: item.idLibro,
            Cantidad: item.cantidad,
          }));

        console.log("Datos enviados al servidor para sincronizar:", payload);

        if (payload.length === 0) {
          console.error("No hay datos válidos para sincronizar.");
          return;
        }

        const response = await fetch(
          "https://localhost:7182/api/Carrito/Sincronizar",
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
          console.error(
            `Error al sincronizar los productos locales con el servidor. Estado: ${response.status}`
          );
          throw new Error("Error al sincronizar productos locales.");
        }

        toast.success("Productos locales sincronizados con tu cuenta.");
        localStorage.removeItem("carrito");
      }

      // Obtener el carrito actualizado desde el servidor
      const response = await fetch(
        "https://localhost:7182/api/Carrito/ListarCarrito",
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      if (!response.ok) {
        console.error(
          `Error al listar el carrito del servidor. Estado: ${response.status}`
        );
        throw new Error("No se pudo obtener el carrito del servidor.");
      }

      const data = await response.json();
      const carritoItems = Array.isArray(data?.items)
        ? data.items.map((item) => ({
            libroId: item.libroId,
            nombre: item.nombreLibro || "Sin nombre",
            cantidad: item.cantidad || 1,
            precio: item.precio || 0,
            urlImagen: item.urlImagen || "placeholder.jpg",
          }))
        : [];
      setItems(carritoItems);
    } catch (error) {
      console.error("Error al sincronizar el carrito:", error);
      toast.error("Error al sincronizar el carrito.");
    }
  };

  const agregarAlCarrito = async (producto, cantidad) => {
    if (!producto || !cantidad) {
      console.error("Producto o cantidad no definidos en agregarAlCarrito.", {
        producto,
        cantidad,
      });
      return;
    }

    if (!auth.token) {
      const existingItem = items.find(
        (item) => item.idLibro === producto.idLibro // Corrección: usar `idLibro`
      );
      const updatedItems = existingItem
        ? items.map((item) =>
            item.idLibro === producto.idLibro
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          )
        : [...items, { ...producto, cantidad }];
      setItems(updatedItems);
      localStorage.setItem("carrito", JSON.stringify(updatedItems));
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
            LibroId: producto.idLibro, // Corrección: usar `idLibro`
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

  const eliminarItem = async (productoId) => {
    if (!productoId) {
      console.error("ID de producto no definido al intentar eliminar.");
      return;
    }

    if (!auth.token) {
      const updatedItems = items.filter((item) => item.idLibro !== productoId); // Corrección: usar `idLibro`
      setItems(updatedItems);
      localStorage.setItem("carrito", JSON.stringify(updatedItems));
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

      setItems(
        (prevItems) => prevItems.filter((item) => item.idLibro !== productoId) // Corrección: usar `idLibro`
      );
      toast.success("Producto eliminado del carrito.");
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      toast.error("Error al eliminar el producto del carrito.");
    }
  };

  const vaciarCarrito = async () => {
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

  const validarStockCarrito = async () => {
    try {
      const idsProductos = items.map((item) => item.idLibro); // Corrección: usar `idLibro`
      const response = await fetch(
        "https://localhost:7182/api/Libro/VerificarStock",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(idsProductos),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Error al verificar el stock de los productos del carrito."
        );
      }

      const stockInfo = await response.json();
      const sinStock = stockInfo.filter(
        (producto) =>
          !producto.Disponible ||
          items.find((item) => item.idLibro === producto.Id)?.cantidad >
            producto.Stock
      );

      if (sinStock.length > 0) {
        toast.error(
          `Los siguientes productos no tienen suficiente stock: ${sinStock
            .map((p) => p.Id)
            .join(", ")}`
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al validar el stock del carrito:", error);
      toast.error("Error al validar el stock del carrito.");
      return false;
    }
  };

  const actualizarCantidad = async (libroId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    if (!auth.token) {
      const updatedItems = items.map((item) =>
        item.idLibro === libroId // Corrección: usar `idLibro`
          ? { ...item, cantidad: nuevaCantidad }
          : item
      );
      setItems(updatedItems);
      localStorage.setItem("carrito", JSON.stringify(updatedItems));
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
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error desconocido al actualizar la cantidad."
        );
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.idLibro === libroId // Corrección: usar `idLibro`
            ? { ...item, cantidad: nuevaCantidad }
            : item
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
        agregarAlCarrito,
        eliminarItem,
        vaciarCarrito,
        validarStockCarrito,
        actualizarCantidad,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
