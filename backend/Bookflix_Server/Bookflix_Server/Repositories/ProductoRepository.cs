using Bookflix_Server.Data;
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

        public async Task<IEnumerable<Libro>> GetAllAsync()
        {
            return await _context.Libros.ToListAsync();
        }

        public async Task<Libro> GetByIdAsync(int id)
        {
            return await _context.Libros.FirstOrDefaultAsync(l => l.IdLibro == id);
        }

        public async Task AddAsync(Libro libro)
        {
            await _context.Libros.AddAsync(libro);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Libro libro)
        {
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

        public async Task<IEnumerable<Libro>> FiltrarLibrosAsync(
            string autor = null,
            string genero = null,
            string isbn = null,
            decimal? precioMin = null,
            decimal? precioMax = null,
            string ordenPor = null,
            bool ascendente = true
        )
        {
            var query = _context.Libros.AsQueryable();

            if (!string.IsNullOrEmpty(autor))
                query = query.Where(l => l.Autor == autor);

            if (!string.IsNullOrEmpty(genero))
                query = query.Where(l => l.Genero == genero);

            if (!string.IsNullOrEmpty(isbn))
                query = query.Where(l => l.ISBN == isbn);

            if (precioMin.HasValue)
                query = query.Where(l => l.Precio >= precioMin.Value);

            if (precioMax.HasValue)
                query = query.Where(l => l.Precio <= precioMax.Value);

            query = ordenPor switch
            {
                "autor" => ascendente ? query.OrderBy(l => l.Autor) : query.OrderByDescending(l => l.Autor),
                "precio" => ascendente ? query.OrderBy(l => l.Precio) : query.OrderByDescending(l => l.Precio),
                "titulo" => ascendente ? query.OrderBy(l => l.Nombre) : query.OrderByDescending(l => l.Nombre),
                _ => query
            };

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Libro>> GetByAutorAsync(string autor)
        {
            return await _context.Libros.Where(l => l.Autor == autor).ToListAsync();
        }

        public async Task<IEnumerable<Libro>> GetByGeneroAsync(string genero)
        {
            return await _context.Libros.Where(l => l.Genero == genero).ToListAsync();
        }

        public async Task<Libro> GetByISBNAsync(string isbn)
        {
            return await _context.Libros.FirstOrDefaultAsync(l => l.ISBN == isbn);
        }
    }
}
