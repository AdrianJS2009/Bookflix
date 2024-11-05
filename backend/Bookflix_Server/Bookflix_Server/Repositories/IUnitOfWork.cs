namespace Bookflix_Server.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; } // Acceso al repo de users
        IReseñasRepository Reseñas { get; } // Acceso al repo de reseñas
        Task<int> CompleteAsync();
    }
}
