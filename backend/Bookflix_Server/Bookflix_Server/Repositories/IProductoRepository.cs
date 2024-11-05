using System.Threading.Tasks;
using Bookflix_Server.Models;

namespace Bookflix_Server.Repositories
{
    internal interface IProductoRepository
    {
        Task<IEnumerable<Libro>> ObtenerTodosAsync();
        Task<Libro> ObtenerPorIdAsync(int id);
        Task AgregarAsync(Libro libro);
        Task ActualizarAsync(Libro libro);
        Task EliminarAsync(int id);

        Task<IEnumerable<Libro>> FiltrarLibrosAsync(
            string autor = null,
            string genero = null,
            string isbn = null,
            decimal? precioMin = null,
            decimal? precioMax = null,
            string ordenPor = null,
            bool ascendente = true
        );

        Task<IEnumerable<Libro>> ObtenerPorAutorAsync(string autor);
        Task<IEnumerable<Libro>> ObtenerPorGeneroAsync(string genero);
        Task<Libro> ObtenerPorISBNAsync(string isbn);
    }
}
