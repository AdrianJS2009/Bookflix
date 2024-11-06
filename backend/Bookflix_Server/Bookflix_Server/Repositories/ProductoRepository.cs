using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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
    }
}
