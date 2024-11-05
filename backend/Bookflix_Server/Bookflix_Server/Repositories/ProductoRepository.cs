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

        public async Task<IEnumerable<Libro>> GetAllLibrosAsync()
        {
            return await _context.Libros.ToListAsync();
        }

        public async Task<Libro> GetLibroByNombreAsync(string nombre)
        {
            return await _context.Libros.FirstOrDefaultAsync(p => p.Nombre == nombre);
        }

        public async Task<Libro> GetLibroByGeneroAsync(string genero)
        {
            return await _context.Libros.FirstOrDefaultAsync(p => p.Genero == genero);
        }

        public async Task<Libro> GetLibroByNombreAutorAsync(string nombreAutor)
        {
            return await _context.Libros.FirstOrDefaultAsync(p => p.Autor == nombreAutor);
        }

        public async Task<Libro> GetLibroByISBNAsync(int ISBN)
        {
            return await _context.Libros.FirstOrDefaultAsync(p => p.ISBN == ISBN);
        }
    }
}
