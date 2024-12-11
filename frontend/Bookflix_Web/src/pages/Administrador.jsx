import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import "../styles/admin.css";
import "../styles/default.css";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function Administrador() {
  const baseURL = import.meta.env.VITE_SERVER_API_BASE_URL;
  const { auth } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [isShowingUsers, setIsShowingUsers] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("body-no-scroll");
    } else {
      document.body.classList.remove("body-no-scroll");
    }
    return () => {
      document.body.classList.remove("body-no-scroll");
    };
  }, [isModalOpen]);

  const fetchData = async (page) => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      const endpoint = isShowingUsers
        ? `${baseURL}/api/user/listar?pagina=${page + 1
        }&tamanoPagina=${itemsPerPage}`
        : `${baseURL}/api/libro/ListarLibros?ascendente=true&pagina=${page + 1
        }&tamanoPagina=${itemsPerPage}`;

      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: ${isShowingUsers ? "Usuarios" : "Productos"
          }`
        );
      }

      const data = await response.json();

      if (isShowingUsers) {
        setUsuarios(data.usuarios || []);
        setPageCount(data.totalPaginas || 0);
      } else {
        setProductos(data.libros || []);
        setPageCount(data.totalPaginas || 0);
      }
    } catch (error) {
      console.error("Error al obtener datos:", error.message);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [isShowingUsers, currentPage, itemsPerPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handlerEditarRol = async (idUser) => {
    if (!auth.token) {
      toast.error("No se encontró un token.");
      return;
    }
  
    try {
      const decoded = JSON.parse(atob(auth.token.split(".")[1]));
      const currentUser = parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
  
      if (currentUser === idUser) {
        toast.info("No puedes cambiar tu propio rol.");
        return;
      }
  
      const response = await fetch(`${baseURL}/api/Gestion/usuarios/${idUser}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
  
      if (response.ok) {
        toast.success("Rol actualizado exitosamente.");
        fetchData(currentPage);
    
      } else {
        toast.error("Error al actualizar el rol.");
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  };
  

  const handleDelete = async (id) => {
    if (currentUser === idUser) {
      toast.info("No puedes eliminarte.");
      return;
    }
    const confirmMessage = `¿Estás seguro de que deseas eliminar este usuario?`;
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`${baseURL}/api/gestion/usuarios/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (response.ok) {
          setUsuarios((prev) => prev.filter((user) => user.idUser !== id));
        } else {
          console.error("No se pudo eliminar el usuario.");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  };

  const handleCreateOrEdit = async (item) => {
    const isEdit = !!item.idLibro;
    const endpoint = isEdit
      ? `${baseURL}/api/gestion/libros/${item.idLibro}`
      : `${baseURL}/api/gestion/libros`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setProductos((prev) => {
          if (isEdit) {
            return prev.map((p) =>
              p.idLibro === updatedItem.idLibro ? updatedItem : p
            );
          } else {
            return [...prev, updatedItem];
          }
        });
        setIsModalOpen(false);
      } else {
        console.error("No se pudo guardar el elemento.");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <main className="admin-page">
      <h1>Administrador</h1>
      <div className="toggle-buttons">
        <Button
          onClick={() => setIsShowingUsers(true)}
          label="Usuarios"
          styleType="btnAñadir"
        />
        <Button
          onClick={() => setIsShowingUsers(false)}
          label="Productos"
          styleType="btnComprar"
        />
      </div>
      <section>
        <h2>{isShowingUsers ? "Usuarios" : "Productos"}</h2>
        {!isShowingUsers && (
          <Button
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="añadirProducto"
            styleType="btnAñadir"
            label="Nuevo Producto"
          />
        )}

        <ul className="listaAdmin">
          {isShowingUsers
            ? usuarios.map((usuario) => (
              <li key={usuario.idUser} className="itemListaAdmin">
                <strong>Nombre:</strong> {usuario.nombre}{" "}
                <strong>Correo:</strong> {usuario.email}
                <strong>Rol:</strong> {usuario.rol}
                <div>
                  <Button
                    onClick={() => handlerEditarRol(usuario.idUser)}
                    label="Toggle Rol"
                    styleType="btnComprar"
                  />
                </div>
                <div>
                  <Button
                    onClick={() => handleDelete(usuario.idUser)}
                    label="Eliminar"
                    className="botonEliminar"
                  />
                </div>
              </li>
            ))
            : productos.map((producto) => (
              <li key={producto.idLibro} className="itemListaAdmin">
                <img
                  src={producto.urlImagen}
                  alt={producto.nombre}
                  width="50"
                />
                <Link to={`/producto/${producto.idLibro}`}>
                  {Array.from(producto.nombre).length > 10
                    ? Array.from(producto.nombre).slice(0, 50).join("") +
                    "..."
                    : producto.nombre}{" "}
                </Link>
                ({(producto.precio / 100).toFixed(2)}€) - Stock:{" "}
                {producto.stock}
                <div>
                  <Button
                    onClick={() => {
                      setSelectedProduct(producto);
                      setIsModalOpen(true);
                    }}
                    label="Editar"
                    styleType="btnComprar"
                  />
                </div>
              </li>
            ))}
        </ul>
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          forcePage={currentPage}
        />
      </section>
      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalAdmin">
            <h2>
              {selectedProduct
                  ? "Editar Producto"
                  : "Crear Producto"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateOrEdit(
                  selectedProduct
                );
              }}
            >
              {!isShowingUsers && (
                <>
                  Nombre:
                  <input
                    type="text"
                    value={selectedProduct?.nombre || ""}
                    placeholder="Nombre"
                    required
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        nombre: e.target.value,
                      })
                    }
                  />
                  Descripción:
                  <textarea
                    value={selectedProduct?.descripcion || ""}
                    placeholder="Descripción"
                    class="texto-pequeño"
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        descripcion: e.target.value,
                      })
                    }
                  ></textarea>
                  Autor:
                  <input
                    type="text"
                    value={selectedProduct?.autor || ""}
                    placeholder="Autor"
                    required
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        autor: e.target.value,
                      })
                    }
                  />
                  Género
                  <input
                    type="text"
                    value={selectedProduct?.genero || ""}
                    placeholder="Género"
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        genero: e.target.value,
                      })
                    }
                  />
                  {"Precio (en céntimos)"}
                  <input
                    type="number"
                    value={selectedProduct?.precio || ""}
                    placeholder="Precio"
                    required
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        precio: parseInt(e.target.value, 10),
                      })
                    }
                  />
                  Stock:
                  <input
                    type="number"
                    value={selectedProduct?.stock || ""}
                    placeholder="Stock"
                    required
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        stock: parseInt(e.target.value, 10),
                      })
                    }
                  />
                  ISBN:
                  <input
                    type="text"
                    value={selectedProduct?.isbn || ""}
                    placeholder="ISBN"
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        isbn: e.target.value,
                      })
                    }
                  />
                  Imagen:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSelectedProduct({
                            ...selectedProduct,
                            urlImagen: reader.result,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </>
              )}

              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
