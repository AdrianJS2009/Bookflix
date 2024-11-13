using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;

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
            try
            {
                return await _context.Carritos
                    .Include(c => c.Items)
                    .ThenInclude(ci => ci.Libro)
                    .FirstOrDefaultAsync(c => c.IdUser == userId);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el carrito.", ex);
            }
        }

        public async Task AñadirItemAsync(int userId, int libroId, int cantidad)
        {
            try
            {
                var carrito = await _context.Carritos
                    .Include(c => c.Items)
                    .FirstOrDefaultAsync(c => c.IdUser == userId);

                if (carrito == null)
                {
                    carrito = new Carrito { IdUser = userId };
                    _context.Carritos.Add(carrito);
                    await _context.SaveChangesAsync();
                }

                var itemExistente = carrito.Items.FirstOrDefault(i => i.LibroId == libroId);

                if (itemExistente != null)
                {
                    itemExistente.Cantidad += cantidad;
                }
                else
                {
                    carrito.Items.Add(new CarritoItem { LibroId = libroId, Cantidad = cantidad });
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al añadir un item al carrito.", ex);
            }
        }

        public async Task ActualizarCantidadProductoAsync(int userId, int libroId, int nuevaCantidad)
        {
            try
            {
                var carrito = await GetCarritoByUserIdAsync(userId);
                var item = carrito?.Items.FirstOrDefault(ci => ci.LibroId == libroId);
                if (item != null)
                {
                    item.Cantidad = nuevaCantidad;
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al actualizar la cantidad del producto en el carrito.", ex);
            }
        }

        public async Task BorrarItemAsync(int userId, int libroId)
        {
            try
            {
                var carrito = await GetCarritoByUserIdAsync(userId);
                var item = carrito?.Items.FirstOrDefault(ci => ci.LibroId == libroId);
                if (item != null)
                {
                    carrito.Items.Remove(item);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al borrar un item del carrito.", ex);
            }
        }

        public async Task ClearCarritoAsync(int userId)
        {
            try
            {
                var carrito = await GetCarritoByUserIdAsync(userId);
                if (carrito != null)
                {
                    carrito.Items.Clear();
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al limpiar el carrito.", ex);
            }
        }

        public async Task<int> GetCarritoTotalAsync(int userId)
        {
            try
            {
                var carrito = await GetCarritoByUserIdAsync(userId);
                return carrito?.Items.Sum(i => i.Subtotal) ?? 0;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al calcular el total del carrito.", ex);
            }
        }
    }
}
