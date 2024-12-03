import React, { useEffect, useState } from "react";
import Button from "../components/Button";

export default function Administrador() {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const usersResponse = await fetch("/api/user/listar");
        const productsResponse = await fetch("/api/gestion/libros");
        if (usersResponse.ok && productsResponse.ok) {
          setUsuarios(await usersResponse.json());
          setProductos(await productsResponse.json());
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const response = await fetch(`/api/gestion/usuarios/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setUsuarios((prev) => prev.filter((user) => user.id !== id));
        } else {
          console.error("Error deleting user");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        const response = await fetch(`/api/gestion/libros/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setProductos((prev) => prev.filter((product) => product.id !== id));
        } else {
          console.error("Error deleting product");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleCreateOrEditUser = async (user) => {
    const endpoint = user.id
      ? `/api/gestion/usuarios/${user.id}`
      : "/api/gestion/usuarios";
    const method = user.id ? "PUT" : "POST";
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsuarios((prev) => {
          if (user.id) {
            return prev.map((u) => (u.id === user.id ? updatedUser : u));
          } else {
            return [...prev, updatedUser];
          }
        });
        setIsUserModalOpen(false);
      } else {
        console.error("Error saving user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateOrEditProduct = async (product) => {
    const endpoint = product.id
      ? `/api/gestion/libros/${product.id}`
      : "/api/gestion/libros";
    const method = product.id ? "PUT" : "POST";
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        setProductos((prev) => {
          if (product.id) {
            return prev.map((p) => (p.id === product.id ? updatedProduct : p));
          } else {
            return [...prev, updatedProduct];
          }
        });
        setIsProductModalOpen(false);
      } else {
        console.error("Error saving product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="admin-page">
      <h1>Administrador</h1>
      <section>
        <h2>Usuarios</h2>
        <Button onClick={() => setIsUserModalOpen(true)}>Crear Usuario</Button>
        <ul>
          {usuarios.map((usuario) => (
            <li key={usuario.id}>
              {usuario.nombre} ({usuario.email})
              <Button onClick={() => handleDeleteUser(usuario.id)}>
                Eliminar
              </Button>
              <Button
                onClick={() => {
                  setSelectedUser(usuario);
                  setIsUserModalOpen(true);
                }}
              >
                Editar
              </Button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Productos</h2>
        <Button onClick={() => setIsProductModalOpen(true)}>
          Crear Producto
        </Button>
        <ul>
          {productos.map((producto) => (
            <li key={producto.id}>
              {producto.nombre} ({producto.precio})
              <Button onClick={() => handleDeleteProduct(producto.id)}>
                Eliminar
              </Button>
              <Button
                onClick={() => {
                  setSelectedProduct(producto);
                  setIsProductModalOpen(true);
                }}
              >
                Editar
              </Button>
            </li>
          ))}
        </ul>
      </section>

      {isUserModalOpen && (
        <div className="modal">
          {/* Formulario para crear/editar usuario */}
          <h2>{selectedUser ? "Editar Usuario" : "Crear Usuario"}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateOrEditUser(selectedUser);
            }}
          >
            <input
              type="text"
              value={selectedUser?.nombre || ""}
              placeholder="Nombre"
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, nombre: e.target.value })
              }
            />
            <input
              type="email"
              value={selectedUser?.email || ""}
              placeholder="Email"
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setIsUserModalOpen(false)}>
              Cancelar
            </button>
          </form>
        </div>
      )}

      {isProductModalOpen && (
        <div className="modal">
          {/* Formulario para crear/editar producto */}
          <h2>{selectedProduct ? "Editar Producto" : "Crear Producto"}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateOrEditProduct(selectedProduct);
            }}
          >
            <input
              type="text"
              value={selectedProduct?.nombre || ""}
              placeholder="Nombre"
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  nombre: e.target.value,
                })
              }
            />
            <input
              type="number"
              value={selectedProduct?.precio || ""}
              placeholder="Precio"
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  precio: e.target.value,
                })
              }
            />
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setIsProductModalOpen(false)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
