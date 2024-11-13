using Bookflix_Server.Data;
using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookflix_Server.Repositories;

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
            .ThenInclude(ci => ci.Libro)
            .FirstOrDefaultAsync(c => c.IdUser == userId);
    }

    public async Task AñadirItemAsync(int userId, int libroId, int cantidad)
    {
        var carrito = await _context.Carritos
            .Include(c => c.Items)  // Incluimos los ítems del carrito para comprobar si el libro ya está en el carrito
            .FirstOrDefaultAsync(c => c.IdUser == userId);

        if (carrito == null)
        {
            carrito = new Carrito { IdUser = userId };
            _context.Carritos.Add(carrito);
            await _context.SaveChangesAsync();  // Guardar el nuevo carrito si no existe
        }

        var itemExistente = carrito.Items.FirstOrDefault(i => i.LibroId == libroId);

        if (itemExistente != null)
        {
            // Si el libro ya está en el carrito, actualizamos la cantidad
            itemExistente.Cantidad += cantidad;
        }
        else
        {
            // Si el libro no está en el carrito, lo agregamos
            carrito.Items.Add(new CarritoItem { LibroId = libroId, Cantidad = cantidad });
        }

        await _context.SaveChangesAsync();  // Guardamos los cambios
    }


    public async Task ActualizarCantidadProductoAsync(int userId, int libroId, int nuevaCantidad)
    {
        var carrito = await GetCarritoByUserIdAsync(userId);
        if (carrito != null)
        {
            var item = carrito.Items.FirstOrDefault(ci => ci.LibroId == libroId);
            if (item != null)
            {
                item.Cantidad = nuevaCantidad;
                await _context.SaveChangesAsync();
            }
        }
    }

    public async Task BorrarItemAsync(int userId, int libroId)
    {
        var carrito = await GetCarritoByUserIdAsync(userId);
        if (carrito != null)
        {
            var item = carrito.Items.FirstOrDefault(ci => ci.LibroId == libroId);
            if (item != null)
            {
                carrito.Items.Remove(item);
                await _context.SaveChangesAsync();
            }
        }
    }

    public async Task ClearCarritoAsync(int userId)
    {
        var carrito = await GetCarritoByUserIdAsync(userId);
        if (carrito != null)
        {
            carrito.Items.Clear();
            await _context.SaveChangesAsync();
        }
    }

    public async Task<int> GetCarritoTotalAsync(int userId)
    {
        var carrito = await GetCarritoByUserIdAsync(userId);
        return carrito?.Items.Sum(i => i.Subtotal) ?? 0;
    }
}
