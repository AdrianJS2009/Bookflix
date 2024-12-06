using Bookflix_Server.Data;
using Microsoft.EntityFrameworkCore;

namespace Bookflix_Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly MyDbContext _context;

        public UserRepository(MyDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }


        public async Task<User> ObtenerPorIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.IdUser == id);
        }


        public async Task<User> ObtenerPorCorreoAsync(string correo)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == correo);
        }

        public async Task AgregarUsuarioAsync(User usuario)
        {
            if (usuario == null)
                throw new ArgumentNullException(nameof(usuario));


            await _context.Users.AddAsync(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarUsuarioAsync(User usuario)
        {
            if (usuario == null)
                throw new ArgumentNullException(nameof(usuario));

            _context.Users.Update(usuario);
            await _context.SaveChangesAsync();
        }


        public async Task EliminarUsuarioAsync(int id)
        {
            var usuario = await ObtenerPorIdAsync(id);
            if (usuario == null)
                throw new InvalidOperationException("El usuario especificado no existe.");

            _context.Users.Remove(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExisteUsuarioPorCorreoAsync(string correo)
        {
            if (string.IsNullOrEmpty(correo))
                throw new ArgumentException("El correo no puede ser nulo o vacío.", nameof(correo));

            return await _context.Users.AnyAsync(u => u.Email == correo);
        }
    }
}
