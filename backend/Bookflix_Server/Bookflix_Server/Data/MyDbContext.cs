using Bookflix_Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookflix_Server.Data
{
    public class MyDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Libro> Libros { get; set; }
        public DbSet<Reseña> Reseñas { get; set; }
        public DbSet<Carrito> Carritos { get; set; }
        public DbSet<CarritoItem> CarritoItems { get; set; }
        public DbSet<Compra> Compras { get; set; }
        public DbSet<CompraDetalle> CompraDetalles { get; set; }

        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("DataSource=bookflix.db");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique()
                .HasDatabaseName("IX_Usuarios_EmailUnico");

            modelBuilder.Entity<Reseña>()
                .HasOne<User>()
                .WithMany(u => u.Reseñas)
                .HasForeignKey(r => r.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Reseña>()
                .HasOne<Libro>(r => r.Libro)
                .WithMany(l => l.Reseñas)
                .HasForeignKey(r => r.ProductoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Carrito>()
              .HasMany(c => c.Items)
              .WithOne()
              .HasForeignKey(ci => ci.CarritoId)
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Compra>()
                .HasMany(c => c.Detalles)
                .WithOne(d => d.Compra)
                .HasForeignKey(d => d.CompraId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CompraDetalle>()
                .HasOne(cd => cd.Libro)
                .WithMany()
                .HasForeignKey(cd => cd.LibroId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}