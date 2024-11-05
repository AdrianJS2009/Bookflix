namespace Bookflix_Server.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; } // Acceso al repo de users
        IReseñasRepository Reseña { get; } // Acceso al repo de reseñas
        Task<int> CompleteAsync();
    }
}
