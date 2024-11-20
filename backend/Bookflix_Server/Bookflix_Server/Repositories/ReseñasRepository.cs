using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookflix_Server.Repositories
{
    public class ReseñasRepository : IReseñasRepository
    {
        private readonly MyDbContext _context;

        public ReseñasRepository(MyDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

       
        public async Task<Reseña> ObtenerPorUsuarioYProductoAsync(int usuarioId, int productoId)
        {
            return await _context.Reseñas
                .FirstOrDefaultAsync(r => r.UsuarioId == usuarioId && r.ProductoId == productoId);
        }


        public async Task AgregarAsync(Reseña reseña)
        {
            if (reseña == null)
                throw new ArgumentNullException(nameof(reseña));

            await _context.Reseñas.AddAsync(reseña);
            await _context.SaveChangesAsync();
        }


        public async Task<bool> ExisteReseñaAsync(int usuarioId, int productoId)
        {
            return await _context.Reseñas
                .AnyAsync(r => r.UsuarioId == usuarioId && r.ProductoId == productoId);
        }

 
        public async Task<IEnumerable<Reseña>> ObtenerPorUsuarioAsync(int usuarioId)
        {
            return await _context.Reseñas
                .Where(r => r.UsuarioId == usuarioId)
                .ToListAsync();
        }

  
        public async Task<IEnumerable<Reseña>> ObtenerPorProductoAsync(int productoId)
        {
            return await _context.Reseñas
                .Where(r => r.ProductoId == productoId)
                .ToListAsync();
        }

        public async Task<double> CalcularPromedioEstrellasAsync(int productoId)
        {
            return await _context.Reseñas
                .Where(r => r.ProductoId == productoId)
                .AverageAsync(r => (double?)r.Estrellas) ?? 0.0;
        }

       
        public async Task<int> ContarReseñasPorProductoAsync(int productoId)
        {
            return await _context.Reseñas
                .CountAsync(r => r.ProductoId == productoId);
        }

        
        public async Task<IEnumerable<Reseña>> ObtenerPorCategoriaAsync(int productoId, string categoria)
        {
            return await _context.Reseñas
                .Where(r => r.ProductoId == productoId && r.Categoria.Equals(categoria, StringComparison.OrdinalIgnoreCase))
                .ToListAsync();
        }
    }
}
