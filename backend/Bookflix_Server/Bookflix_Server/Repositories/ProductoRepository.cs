using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookflix_Server.Repositories
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly MyDbContext _context;

        public ProductoRepository(MyDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> GetCountAsync()
        {
            return await _context.Libros.CountAsync();
        }

        // Lista paginada
        public async Task<IEnumerable<Libro>> GetLibrosPagedAsync(int page, int pageSize)
        {
            return await _context.Libros
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Libro>> GetAllAsync()
        {
            return await _context.Libros.ToListAsync();
        }

        public async Task<Libro> GetByIdAsync(int id)
        {
            return await _context.Libros.FindAsync(id);
        }

        public async Task AddAsync(Libro libro)
        {
            if (libro == null) throw new ArgumentNullException(nameof(libro));
            await _context.Libros.AddAsync(libro);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Libro libro)
        {
            if (libro == null) throw new ArgumentNullException(nameof(libro));
            _context.Libros.Update(libro);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var libro = await GetByIdAsync(id);
            if (libro != null)
            {
                _context.Libros.Remove(libro);
                await _context.SaveChangesAsync();
            }
        }

        // Filtros
        public async Task<IEnumerable<Libro>> FiltrarLibrosAsync(
            string autor = null,
            string genero = null,
            string isbn = null,
            double? precioMin = null,
            double? precioMax = null,
            string ordenPor = null,
            bool ascendente = true)
        {
            var query = _context.Libros.AsQueryable();

            if (!string.IsNullOrEmpty(autor))
                query = query.Where(l => l.Autor.Contains(autor));

            if (!string.IsNullOrEmpty(genero))
                query = query.Where(l => l.Genero.Contains(genero));

            if (!string.IsNullOrEmpty(isbn))
                query = query.Where(l => l.ISBN == isbn);

            if (precioMin.HasValue)
                query = query.Where(l => l.Precio >= precioMin.Value);

            if (precioMax.HasValue)
                query = query.Where(l => l.Precio <= precioMax.Value);

            query = ordenPor switch
            {
                "precio" => ascendente ? query.OrderBy(l => l.Precio) : query.OrderByDescending(l => l.Precio),
                _ => ascendente ? query.OrderBy(l => l.Nombre) : query.OrderByDescending(l => l.Nombre)
            };

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Libro>> Buscador(string textoBuscado = null)
        {
            var query = _context.Libros.AsQueryable();

            if (!string.IsNullOrEmpty(textoBuscado))
            {
                query = query.Where(l => l.Nombre.Contains(textoBuscado) ||
                                         l.Autor.Contains(textoBuscado) ||
                                         l.Genero.Contains(textoBuscado) ||
                                         l.ISBN == textoBuscado);
            }

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Libro>> GetByAutorAsync(string autor)
        {
            return await _context.Libros
                .Where(l => l.Autor.Contains(autor))
                .ToListAsync();
        }

        public async Task<IEnumerable<Libro>> GetByGeneroAsync(string genero)
        {
            return await _context.Libros
                .Where(l => l.Genero.Contains(genero))
                .ToListAsync();
        }

        public async Task<Libro> GetByISBNAsync(string isbn)
        {
            return await _context.Libros
                .FirstOrDefaultAsync(l => l.ISBN == isbn);
        }

        // Nuevos métodos para control de stock y reseñas
        public async Task<bool> CheckStockAsync(int productId, int quantity)
        {
            var producto = await _context.Libros.FindAsync(productId);
            return producto != null && producto.Stock >= quantity;
        }

        public async Task<decimal> GetAverageRatingAsync(int productId)
        {
            return await _context.Reseñas
                .Where(r => r.ProductoId == productId)
                .AverageAsync(r => (decimal?)r.Estrellas) ?? 0;
        }

        public async Task<int> GetReviewCountAsync(int productId)
        {
            return await _context.Reseñas
                .CountAsync(r => r.ProductoId == productId);
        }

        public async Task<IEnumerable<Reseña>> GetReseñasByProductoIdAsync(int productId)
        {
            return await _context.Reseñas
                .Where(r => r.ProductoId == productId)
                .OrderByDescending(r => r.FechaPublicacion)
                .ToListAsync();
        }
        public async Task<List<string>> GetAllNombres()
        {
            var nombres = await _context.Libros
                                        .Select(l => l.Nombre)
                                        .ToListAsync();

            return nombres; // Devolver directamente la lista de nombres
        }
    }
}
