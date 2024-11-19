namespace Bookflix_Server.Repositories
{
    public interface IUserRepository
    {

        Task<User> ObtenerPorIdAsync(int id);


        Task<User> ObtenerPorCorreoAsync(string correo);


        Task AgregarUsuarioAsync(User usuario);


        Task ActualizarUsuarioAsync(User usuario);


        Task EliminarUsuarioAsync(int id);


        Task<bool> ExisteUsuarioPorCorreoAsync(string correo);
    }
}
