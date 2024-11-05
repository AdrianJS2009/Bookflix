using System.Threading.Tasks;
using Bookflix_Server.Models;

namespace Bookflix_Server.Repositories
{
    internal interface IProductoRepository
    {
        Task<IEnumerable<Libro>> GetAllLibrosAsync();
        Task<Libro> GetByIdAsync(int id);
        Task AddAsync(Libro libro);
        Task UpdateAsync(Libro libro);

        Task<IEnumerable<Libro>> FiltrarLibrosAsync
        (
            string autor = null,
            string genero = null,
            string isbn = null,
            decimal? precioMin = null,
            decimal? precioMax = null,
            string ordenPor = null,
            bool ascendente = true
        );

        Task<IEnumerable<Libro>> GetByAutorAsync(string autor);
        Task<IEnumerable<Libro>> GetByGeneroAsync(string genero);
        Task<Libro> GetByISBNAsync(string isbn);
    }
}
