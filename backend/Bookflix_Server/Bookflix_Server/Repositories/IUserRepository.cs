namespace Bookflix_Server.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(int id); // Método para obtener un usuario por ID
        Task AddAsync(User user); // Método para añadir un nuevo usuario
        Task<bool> UserExistsAsync(string email); // Verifica si un usuario existe via email
    }
}
