using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;
using System;


namespace Bookflix_Server.Repositories
{
    public class CompraRepository : ICompraRepository
    {
        private readonly MyDbContext _context;

        public CompraRepository(MyDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task RegistrarCompraAsync(Compras compra)
        {
            if (compra == null)
                throw new ArgumentNullException(nameof(compra));

            _context.Compras.Add(compra);
            await GuardarCambiosAsync();
        }

        public async Task<CompraDetalle> ObtenerCompraPorUsuarioYProductoAsync(int usuarioId, int libroId)
        {
            return await _context.CompraDetalles
                .Where(cd => cd.Compra.UsuarioId == usuarioId && cd.IdLibro == libroId)
                .FirstOrDefaultAsync();
        }


        public async Task<IEnumerable<Compras>> ObtenerComprasPorUsuarioIdAsync(int usuarioId)
        {
            return await _context.Compras
                .Include(c => c.Detalles)
                .ThenInclude(d => d.Libro)
                .Where(c => c.UsuarioId == usuarioId)
                .ToListAsync();
        }

        public async Task GuardarCambiosAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}