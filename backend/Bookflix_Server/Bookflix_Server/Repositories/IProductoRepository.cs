using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookflix_Server.Repositories
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly MyDbContext _context;

        public ProductoRepository(MyDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Obtiene el número total de libros en la base de datos
        public async Task<int> GetCountAsync()
        {
            return await _context.Libros.CountAsync();
        }

        // Obtiene una lista paginada de libros
        public async Task<IEnumerable<Libro>> GetLibrosPagedAsync(int page, int pageSize)
        {
            return await _context.Libros
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        // Obtiene todos los libros
        public async Task<IEnumerable<Libro>> GetAllAsync()
        {
            return await _context.Libros.ToListAsync();
        }

        // Obtiene un libro por su ID
        public async Task<Libro> GetByIdAsync(int id)
        {
            return await _context.Libros.FindAsync(id);
        }

        // Añade un nuevo libro a la base de datos
        public async Task AddAsync(Libro libro)
        {
            if (libro == null) throw new ArgumentNullException(nameof(libro));
            await _context.Libros.AddAsync(libro);
            await _context.SaveChangesAsync();
        }

        // Actualiza un libro existente
        public async Task UpdateAsync(Libro libro)
        {
            if (libro == null) throw new ArgumentNullException(nameof(libro));
            _context.Libros.Update(libro);
            await _context.SaveChangesAsync();
        }

        // Elimina un libro por su ID
        public async Task DeleteAsync(int id)
        {
            var libro = await GetByIdAsync(id);
            if (libro != null)
            {
                _context.Libros.Remove(libro);
                await _context.SaveChangesAsync();
            }
        }

        // Filtra libros según criterios especificados
        public async Task<IEnumerable<Libro>> FiltrarLibrosAsync(
            string autor = null,
            string genero = null,
            string isbn = null,
            decimal? precioMin = null,
            decimal? precioMax = null,
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

        // Obtiene libros por autor
        public async Task<IEnumerable<Libro>> GetByAutorAsync(string autor)
        {
            return await _context.Libros
                .Where(l => l.Autor.Contains(autor))
                .ToListAsync();
        }

        // Obtiene libros por género
        public async Task<IEnumerable<Libro>> GetByGeneroAsync(string genero)
        {
            return await _context.Libros
                .Where(l => l.Genero.Contains(genero))
                .ToListAsync();
        }

        // Obtiene un libro por su ISBN
        public async Task<Libro> GetByISBNAsync(string isbn)
        {
            return await _context.Libros
                .FirstOrDefaultAsync(l => l.ISBN == isbn);
        }
    }
}
