using Bookflix_Server.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Bookflix_Server.Repositories
{
    public interface IProductoRepository
    {
        Task<int> ObtenerConteoAsync();
        Task<IEnumerable<Libro>> ObtenerLibrosPaginadosAsync(int pagina, int tamañoPagina);
        Task<IEnumerable<Libro>> ObtenerTodosAsync();
        Task<bool> VerificarStockAsync(int idProducto, int cantidad);
        Task<bool> ReducirStockAsync(int idProducto, int cantidad); // Nuevo método agregado
        Task<decimal> ObtenerPromedioCalificacionesAsync(int idProducto);
        Task<int> ObtenerCantidadReseñasAsync(int idProducto);
        Task<IEnumerable<Reseña>> ObtenerReseñasPorProductoIdAsync(int idProducto);
        Task<Libro> ObtenerPorIdAsync(int id);
        Task AgregarAsync(Libro libro);
        Task ActualizarAsync(Libro libro);
        Task EliminarAsync(int id);
        Task<IEnumerable<Libro>> FiltrarLibrosAsync(
            string autor = null,
            string genero = null,
            string isbn = null,
            double? precioMin = null,
            double? precioMax = null,
            string ordenPor = null,
            bool ascendente = true
        );
        Task<IEnumerable<Libro>> Buscador(string textoBusqueda = null);
        Task<IEnumerable<Libro>> ObtenerPorAutorAsync(string autor);
        Task<IEnumerable<Libro>> ObtenerPorGeneroAsync(string genero);
        Task<Libro> ObtenerPorISBNAsync(string isbn);
        Task<List<string>> ObtenerTodosLosNombres();
    }
}
