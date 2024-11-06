namespace Bookflix_Server.Repositories
{
    public interface IUserRepository
    {
        // Obtiene un usuario por su ID
        Task<User> GetByIdAsync(int id);

        // Obtiene un usuario por su correo electrónico
        Task<User> GetByEmailAsync(string email);

        // Agrega un nuevo usuario
        Task AddUserAsync(User user);

        // Actualiza un usuario existente
        Task UpdateUserAsync(User user);

        // Elimina un usuario por su ID
        Task DeleteUserAsync(int id);

        // Verifica si un usuario con un correo electrónico específico ya existe
        Task<bool> UserExistsAsync(string email);
    }
}
