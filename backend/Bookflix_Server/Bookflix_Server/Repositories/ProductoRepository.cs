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

        
        public async Task<int> ObtenerConteoAsync()
        {
            return await _context.Libros.CountAsync();
        }

        
        public async Task<IEnumerable<Libro>> ObtenerLibrosPaginadosAsync(int pagina, int tamañoPagina)
        {
            return await _context.Libros
                .Skip((pagina - 1) * tamañoPagina)
                .Take(tamañoPagina)
                .ToListAsync();
        }

        
        public async Task<IEnumerable<Libro>> ObtenerTodosAsync()
        {
            return await _context.Libros.ToListAsync();
        }

        
        public async Task<Libro> ObtenerPorIdAsync(int id)
        {
            return await _context.Libros.FindAsync(id);
        }

       
        public async Task AgregarAsync(Libro libro)
        {
            if (libro == null) throw new ArgumentNullException(nameof(libro));
            await _context.Libros.AddAsync(libro);
            await _context.SaveChangesAsync();
        }

 
        public async Task ActualizarAsync(Libro libro)
        {
            if (libro == null) throw new ArgumentNullException(nameof(libro));
            _context.Libros.Update(libro);
            await _context.SaveChangesAsync();
        }

       
        public async Task EliminarAsync(int id)
        {
            var libro = await ObtenerPorIdAsync(id);
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

       
        public async Task<IEnumerable<Libro>> Buscador(string textoBusqueda = null)
        {
            var query = _context.Libros.AsQueryable();

            if (!string.IsNullOrEmpty(textoBusqueda))
            {
                query = query.Where(l => l.Nombre.Contains(textoBusqueda) ||
                                         l.Autor.Contains(textoBusqueda) ||
                                         l.Genero.Contains(textoBusqueda) ||
                                         l.ISBN == textoBusqueda);
            }

            return await query.ToListAsync();
        }

       
        public async Task<IEnumerable<Libro>> ObtenerPorAutorAsync(string autor)
        {
            return await _context.Libros
                .Where(l => l.Autor.Contains(autor))
                .ToListAsync();
        }

       
        public async Task<IEnumerable<Libro>> ObtenerPorGeneroAsync(string genero)
        {
            return await _context.Libros
                .Where(l => l.Genero.Contains(genero))
                .ToListAsync();
        }

       
        public async Task<Libro> ObtenerPorISBNAsync(string isbn)
        {
            return await _context.Libros
                .FirstOrDefaultAsync(l => l.ISBN == isbn);
        }

       
        public async Task<bool> VerificarStockAsync(int idProducto, int cantidad)
        {
            var producto = await _context.Libros.FindAsync(idProducto);
            return producto != null && producto.Stock >= cantidad;
        }

       
        public async Task<decimal> ObtenerPromedioCalificacionesAsync(int idProducto)
        {
            return await _context.Reseñas
                .Where(r => r.ProductoId == idProducto)
                .AverageAsync(r => (decimal?)r.Estrellas) ?? 0;
        }

        
        public async Task<int> ObtenerCantidadReseñasAsync(int idProducto)
        {
            return await _context.Reseñas
                .CountAsync(r => r.ProductoId == idProducto);
        }

       
        public async Task<IEnumerable<Reseña>> ObtenerReseñasPorProductoIdAsync(int idProducto)
        {
            return await _context.Reseñas
                .Where(r => r.ProductoId == idProducto)
                .OrderByDescending(r => r.FechaPublicacion)
                .ToListAsync();
        }

        
        public async Task<List<string>> ObtenerTodosLosNombres()
        {
            return await _context.Libros
                .Select(l => l.Nombre)
                .ToListAsync();
        }

        public async Task ActualizarLibroAsync(Libro libro)
        {
            if (libro == null) throw new ArgumentNullException(nameof(libro));
            _context.Libros.Update(libro);
            await _context.SaveChangesAsync();
        }

    }
}

