using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Bookflix_Server.Repositories
{
    public class CarritoRepository : ICarritoRepository
    {
        private readonly MyDbContext _context;

        public CarritoRepository(MyDbContext context)
        {
            _context = context;
        }

        public async Task<Carrito> GetCarritoByUserIdAsync(int userId)
        {
            return await _context.Carritos
                .Include(c => c.Items)
                .ThenInclude(item => item.Libro)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }


        public async Task<Carrito> GetOrCreateCarritoByUserIdAsync(int userId)
        {
            var carrito = await GetCarritoByUserIdAsync(userId);
            if (carrito == null)
            {
                carrito = new Carrito { UserId = userId };
                _context.Carritos.Add(carrito);
                await _context.SaveChangesAsync();
            }
            return carrito;
        }

        public async Task AgregarItemAlCarritoAsync(Carrito carrito, int libroId, int cantidad)
        {
            var item = carrito.Items.FirstOrDefault(i => i.LibroId == libroId);
            if (item == null)
            {
                carrito.Items.Add(new CarritoItem { LibroId = libroId, Cantidad = cantidad });
            }
            else
            {
                item.Cantidad += cantidad;
            }
            await SaveChangesAsync();
        }

        public async Task<bool> EliminarItemDelCarritoAsync(Carrito carrito, int libroId)
        {
            var item = carrito.Items.FirstOrDefault(i => i.LibroId == libroId);
            if (item == null) return false;

            carrito.Items.Remove(item);
            await SaveChangesAsync();
            return true;
        }

        public async Task LimpiarCarritoAsync(Carrito carrito)
        {
            carrito.Items.Clear();
            await SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<bool> HasUserPurchasedProductAsync(int userId, int productoId)
        {
            return await _context.Carritos
                .Include(c => c.Items)
                .AnyAsync(c => c.UserId == userId && c.Items.Any(item => item.LibroId == productoId && item.Comprado));
        }
    }
}
