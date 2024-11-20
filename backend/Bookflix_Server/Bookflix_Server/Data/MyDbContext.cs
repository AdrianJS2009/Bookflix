using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookflix_Server.Data
{
    public class MyDbContext : DbContext
    {
        // Definición de las entidades en la base de datos
        public DbSet<User> Users { get; set; }
        public DbSet<Libro> Libros { get; set; }
        public DbSet<Reseña> Reseñas { get; set; }
        public DbSet<CarritoItem> ItemsCarrito { get; set; }
        public DbSet<Carrito> Carritos { get; set; }

        // Constructor del contexto
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        // Configuración predeterminada de la base de datos
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("DataSource=bookflix.db");
            }
        }

        // Configuración de las relaciones y restricciones en las entidades
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración única para el campo Email en la entidad Usuario
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique()
                .HasDatabaseName("IX_Usuarios_EmailUnico");

            // Relación Usuario (1) -> Reseñas (N)
            modelBuilder.Entity<Reseña>()
                .HasOne<User>()
                .WithMany(u => u.Reseñas)
                .HasForeignKey(r => r.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación Libro (1) -> Reseñas (N)
            modelBuilder.Entity<Reseña>()
                .HasOne<Libro>(r => r.Libro)
                .WithMany(l => l.Reseñas)
                .HasForeignKey(r => r.ProductoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación Carrito (1) -> ItemsCarrito (N)
            modelBuilder.Entity<Carrito>()
                .HasMany(c => c.Items)
                .WithOne()
                .HasForeignKey(ci => ci.Id)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
