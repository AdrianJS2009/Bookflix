import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import "../styles/admin.css";
import "../styles/default.css";

export default function Administrador() {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [isShowingUsers, setIsShowingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchData = async (page) => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      const endpoint = isShowingUsers
        ? `https://localhost:7182/api/user/listar?pagina=${
            page + 1
          }&tamanoPagina=${itemsPerPage}`
        : `https://localhost:7182/api/libro/ListarLibros?ascendente=true&pagina=${
            page + 1
          }&tamanoPagina=${itemsPerPage}`;

      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: ${
            isShowingUsers ? "Usuarios" : "Productos"
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

  const handleDelete = async (id) => {
    const confirmMessage = `¿Estás seguro de que deseas eliminar este ${
      isShowingUsers ? "usuario" : "producto"
    }?`;
    if (window.confirm(confirmMessage)) {
      const token = sessionStorage.getItem("token");
      const endpoint = isShowingUsers
        ? `https://localhost:7182/api/gestion/usuarios/${id}`
        : `https://localhost:7182/api/gestion/libros/${id}`;
      try {
        const response = await fetch(endpoint, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          if (isShowingUsers) {
            setUsuarios((prev) => prev.filter((user) => user.idUser !== id));
          } else {
            setProductos((prev) =>
              prev.filter((product) => product.idLibro !== id)
            );
          }
        } else {
          console.error("No se pudo eliminar el elemento.");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  };

  const handleCreateOrEdit = async (item) => {
    const token = sessionStorage.getItem("token");
    const isEdit = isShowingUsers ? !!item.idUser : !!item.idLibro;
    const endpoint = isEdit
      ? isShowingUsers
        ? `https://localhost:7182/api/gestion/usuarios/${item.idUser}`
        : `https://localhost:7182/api/gestion/libros/${item.idLibro}`
      : isShowingUsers
      ? `https://localhost:7182/api/gestion/usuarios`
      : `https://localhost:7182/api/gestion/libros`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        if (isShowingUsers) {
          setUsuarios((prev) => {
            if (isEdit) {
              return prev.map((u) =>
                u.idUser === updatedItem.idUser ? updatedItem : u
              );
            } else {
              return [...prev, updatedItem];
            }
          });
        } else {
          setProductos((prev) => {
            if (isEdit) {
              return prev.map((p) =>
                p.idLibro === updatedItem.idLibro ? updatedItem : p
              );
            } else {
              return [...prev, updatedItem];
            }
          });
        }
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
              setSelectedUser(null);
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
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
                      onClick={() => {
                        setSelectedUser(usuario);
                        setIsModalOpen(true);
                      }}
                      label="Cambiar rol"
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
                <li key={producto.idLibro}  className="itemListaAdmin">
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
              {isShowingUsers
                ? selectedUser
                  ? "Cambiar rol"
                  : "Crear Usuario"
                : selectedProduct
                ? "Editar Producto"
                : "Crear Producto"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateOrEdit(
                  isShowingUsers ? selectedUser : selectedProduct
                );
              }}
            >
              {isShowingUsers ? (
                <>
                  <input
                    type="text"
                    value={selectedUser?.rol || "usuario"}
                    placeholder="Rol"
                    required
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, rol: e.target.value })
                    }
                  />
                  {!selectedUser?.idUser && (
                    <input
                      type="password"
                      value={selectedUser?.password || ""}
                      placeholder="Password"
                      required
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          password: e.target.value,
                        })
                      }
                    />
                  )}
                </>
              ) : (
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
                  Precio
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
