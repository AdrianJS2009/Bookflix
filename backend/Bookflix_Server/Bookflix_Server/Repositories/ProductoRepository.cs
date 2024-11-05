using System.Collections.Generic;
using System.Threading.Tasks;
using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;


namespace Bookflix_Server.Repositories
{
    internal class ProductoRepository : IProductoRepository
    {
        private readonly MyDbContext _context;

        public ProductoRepository(MyDbContext context)
        {
            _context = context;
        }

        //Funciones de los libros
        public async Task<IEnumerable<Libro>> GetAllLibrosAsync()
        {
            return await _context.Libros.ToListAsync();
        }

        public async Task<Libro> GetByIdAsync(int id)
        {
            return await _context.Libros.FirstOrDefaultAsync(p => p.IdLibro == id);
        }

        public async Task AddAsync(Libro libro)
        {
            await _context.Libros.AddAsync(libro);
        }

        public async Task UpdateAsync(Libro libro)
        {
            _context.Entry(libro).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
        
        //FiltrarCatalogo
        public async Task<IEnumerable<Libro>> FiltrarLibrosAsync
            (
                string autor, 
                string genero,
                string isbn,
                decimal? precioMin,
                decimal? precioMax,
                string ordenPor,
                bool ascendente
            ) 
        {
            IQueryable<Libro> query = _context.Libros;

            if (!string.IsNullOrEmpty(autor)) { 
                query = query.Where(q => q.Autor == autor);
            }

            if (!string.IsNullOrEmpty(genero))
            {
                query = query.Where(q => q.Genero == genero);
            }

            if (!string.IsNullOrEmpty(isbn))
            {
                query = query.Where(q => q.ISBN == isbn);
            }

            if (!precioMin.HasValue)
            {
                query = query.Where(q => q.Precio <= precioMin.Value);
            }

            if (!precioMax.HasValue)
            {
                query = query.Where(q => q.Precio >= precioMax.Value);
            }

            if (!string.IsNullOrEmpty(ordenPor))
            {
                query = ordenPor switch
                {
                    "autor" => ascendente ? query.OrderBy(q => q.Autor) : query.OrderByDescending(q => q.Autor),
                    "precio" => ascendente ? query.OrderBy(q => q.Precio) : query.OrderByDescending(q => q.Precio),
                    "titulo" => ascendente ? query.OrderBy(q => q.Nombre) : query.OrderByDescending(q => q.Nombre),
                    _ => query
                };
            }

            return await query.ToListAsync();
        }

        public async Task<Libro> GetLibroByNombreAsync(string nombre)
        {
            return await _context.Libros.FirstOrDefaultAsync(p => p.Nombre == nombre);
        }

        public async Task<IEnumerable<Libro>> GetByGeneroAsync(string genero)
        {
            return await _context.Libros.Where(p => p.Genero == genero).ToListAsync();
        }

        public async Task<IEnumerable<Libro>> GetByAutorAsync(string nombreAutor)
        {
            return await _context.Libros.Where(p => p.Autor == nombreAutor).ToListAsync();
        }

        public async Task<Libro> GetByISBNAsync(string ISBN)
        {
            return await _context.Libros.FirstOrDefaultAsync(p => p.ISBN == ISBN);
        }
    }
}
