using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookflix_Server.Repositories
{
    public interface IProductoRepository
    {
        Task<int> GetCountAsync();

        Task<IEnumerable<Libro>> GetLibrosPagedAsync(int page, int pageSize);

        Task<IEnumerable<Libro>> GetAllAsync();

        Task<bool> CheckStockAsync(int productId, int quantity);

        Task<decimal> GetAverageRatingAsync(int productId);

        Task<int> GetReviewCountAsync(int productId);

        Task<IEnumerable<Reseña>> GetReseñasByProductoIdAsync(int productId);

        Task<Libro> GetByIdAsync(int id);

        Task AddAsync(Libro libro);

        Task UpdateAsync(Libro libro);

        Task DeleteAsync(int id);

        // Filtros
        Task<IEnumerable<Libro>> FiltrarLibrosAsync(
            string autor = null,
            string genero = null,
            string isbn = null,
            double? precioMin = null,
            double? precioMax = null,
            string ordenPor = null,
            bool ascendente = true
        );

        Task<IEnumerable<Libro>> Buscador(string textoBuscado = null);


        Task<IEnumerable<Libro>> GetByAutorAsync(string autor);


        Task<IEnumerable<Libro>> GetByGeneroAsync(string genero);


        Task<Libro> GetByISBNAsync(string isbn);

        public Task<List<string>> GetAllNombres();
    }
}
