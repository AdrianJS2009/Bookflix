namespace Bookflix_Server.Repositories
{
    public interface IProductoRepository
    {
        // Obtiene todos los libros
        Task<IEnumerable<Libro>> GetAllAsync();

        // Obtiene un libro por su ID
        Task<Libro> GetByIdAsync(int id);

        // Agrega un nuevo libro
        Task AddAsync(Libro libro);

        // Actualiza un libro existente
        Task UpdateAsync(Libro libro);

        // Elimina un libro por su ID
        Task DeleteAsync(int id);

        // Filtra los libros en función de varios criterios
        Task<IEnumerable<Libro>> FiltrarLibrosAsync(
            string autor = null,
            string genero = null,
            string isbn = null,
            decimal? precioMin = null,
            decimal? precioMax = null,
            string ordenPor = null,
            bool ascendente = true
        );

        // Obtiene libros por autor
        Task<IEnumerable<Libro>> GetByAutorAsync(string autor);

        // Obtiene libros por género
        Task<IEnumerable<Libro>> GetByGeneroAsync(string genero);

        // Obtiene un libro por ISBN
        Task<Libro> GetByISBNAsync(string isbn);
    }
}
