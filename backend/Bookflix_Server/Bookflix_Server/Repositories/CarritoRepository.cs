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
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Obtiene el carrito de un usuario por su ID
        public async Task<Carrito> ObtenerCarritoPorUsuarioIdAsync(int idUsuario)
        {
            return await _context.Carritos
                .Include(c => c.Items)
                .ThenInclude(item => item.Libro)
                .FirstOrDefaultAsync(c => c.UserId == idUsuario);
        }

        // Obtiene o crea un carrito para un usuario
        public async Task<Carrito> ObtenerOCrearCarritoPorUsuarioIdAsync(int idUsuario)
        {
            var carrito = await ObtenerCarritoPorUsuarioIdAsync(idUsuario);
            if (carrito == null)
            {
                carrito = new Carrito { UserId = idUsuario };
                _context.Carritos.Add(carrito);
                await GuardarCambiosAsync();
            }
            return carrito;
        }

        // Agrega un producto al carrito
        public async Task AgregarProductoAlCarritoAsync(Carrito carrito, int idProducto, int cantidad)
        {
            if (carrito == null || cantidad <= 0)
                throw new ArgumentException("El carrito es nulo o la cantidad no es válida.");

            var item = carrito.Items.FirstOrDefault(i => i.LibroId == idProducto);
            if (item == null)
            {
                var nuevoItem = new CarritoItem { LibroId = idProducto, Cantidad = cantidad, CarritoId = carrito.CarritoId };
                _context.CarritoItems.Attach(nuevoItem); 
                carrito.Items.Add(nuevoItem);
            }
            else
            {
                item.Cantidad += cantidad;
            }
            await GuardarCambiosAsync();

        }

        // Elimina un producto del carrito
        public async Task<bool> EliminarProductoDelCarritoAsync(Carrito carrito, int idProducto)
        {
            if (carrito == null)
                throw new ArgumentNullException(nameof(carrito));

            var item = carrito.Items.FirstOrDefault(i => i.LibroId == idProducto);
            if (item == null) return false;

            carrito.Items.Remove(item);
            await GuardarCambiosAsync();
            return true;
        }

        // Vacía el carrito
        public async Task VaciarCarritoAsync(Carrito carrito)
        {
            if (carrito == null)
                throw new ArgumentNullException(nameof(carrito));

            carrito.Items.Clear();
            await GuardarCambiosAsync();
        }

        // Guarda los cambios en el contexto
        public async Task GuardarCambiosAsync()
        {
            await _context.SaveChangesAsync();
        }

        // Verifica si un usuario ha comprado un producto
        public async Task<bool> UsuarioHaCompradoProductoAsync(int idUsuario, int idProducto)
        {
            return await _context.Carritos
                .Include(c => c.Items)
                .AnyAsync(c => c.UserId == idUsuario && c.Items.Any(item => item.LibroId == idProducto && item.Comprado));
        }
    }
}
