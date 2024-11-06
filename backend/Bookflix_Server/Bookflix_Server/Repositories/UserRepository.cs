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

        public async Task<User> GetByIdAsync(int id)
        {
            // Busca un usuario por su ID
            return await _context.Users.FirstOrDefaultAsync(u => u.IdUser == id);
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            // Busca un usuario por su correo electrónico
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(User user)
        {
            // Agrega un nuevo usuario al contexto
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUserAsync(User user)
        {
            // Actualiza los datos de un usuario existente
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(int id)
        {
            // Elimina un usuario por su ID
            var user = await GetByIdAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            // Verifica si un usuario con el correo especificado ya existe
            return await _context.Users.AnyAsync(u => u.Email == email);
        }
    }
}
