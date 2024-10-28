using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookflix_Server.Models
{
    public class User //Creo los atributos del usuario según los datos que se van a pedir en el formulario de registro y los que formulan en nuestra BBDD
    {
        [Key]   //Defino la clave primaria
        public int IdUser { get; set; }

        [Required]  //Defino los campos de nombre, apellidos, email, dirección y rol
        public string Nombre { get; set; }

        [Required]
        public string Apellidos { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Direccion { get; set; }

        [Required]
        [DefaultValue("usuario")]   //Defino el campo Rol con un valor por defecto de "usuario"
        public string Rol { get; set; } = "usuario";
    }

    public class BookflixContext : DbContext    //Creo la clase BookflixContext que hereda de DbContext para poder interactuar con la BBDD
    {
        public DbSet<User> Users { get; set; }  //Define una propiedad par la entidad User

        protected override void OnModelCreating(ModelBuilder modelBuilder)  //Sobreescribo el método OnModelCreating para definir una restricción de unicidad en el campo Email
        {
            modelBuilder.Entity<User>() //Defino la entidad User
                .HasIndex(u => u.Email) //Defino un índice en el campo Email
                .IsUnique();    //Defino que el índice sea único

            base.OnModelCreating(modelBuilder); //Llamo al método base
        }
    }

    public class Pedidos //Creo los atributos de los pedidos según los datos que se van a pedir en el formulario de registro y los que formulan en nuestra BBDD
    {
        [Key]   //Defino la clave primaria
        public int IdPedido { get; set; }

        [Required]  //Defino los campos de fecha, precio, estado y usuario
        public DateTime Fecha { get; set; }

        [Required]
        public double Precio { get; set; }

        [Required]
        public User Usuario { get; set; }
    }

    public class Bundles //Creo los atributos de los paquetes según los datos que se van a pedir en el formulario de registro y los que formulan en nuestra BBDD
    {
        [Key]   //Defino la clave primaria
        public int IdBundle { get; set; }

        [Required]  //Defino los campos de nombre, precio, descripción y libros
        public string Nombre { get; set; }

        [Required]
        public double Precio { get; set; }

        [Required]
        public string Descripcion { get; set; }

        [Required]
        public List<Productos> Productos { get; set; } // Defino la lista de libros

        // Constructor para inicializar la lista de libros
        public Bundles()
        {
            Productos = new List<Productos>();
        }

        [Required]
        public string ImagenUrl { get; set; } // Nueva propiedad para la URL de la imagen
    }

    // Definición de la clase Book
    public class Productos
    {
        [Key]
        public int IdBook { get; set; }

        [Required]
        public string Titulo { get; set; }

        [Required]
        public string Autor { get; set; }

        [Required]
        public double Precio { get; set; }
    }

    public class Reseñas //Creo los atributos de las reseñas según los datos que se van a pedir en el formulario de registro y los que formulan en nuestra BBDD
    {
        [Key]   //Defino la clave primaria
        public int IdReseña { get; set; }

        [Required]  //Defino los campos de fecha, puntuación, comentario y usuario
        public string Comentario { get; set; }

        [Required]  
        public DateTime Fecha { get; set; }

        [Required]
        public int Puntuacion { get; set; }

        [Required]
        public User Usuario { get; set; }

        [Required]
        public Productos Producto { get; set; }
    }

    public class Contenido_Bundle //Creo los atributos de los contenidos de los paquetes según los datos que se van a pedir en el formulario de registro y los que formulan en nuestra BBDD
    {
        [Key]   //Defino la clave primaria
        public int IdContenido { get; set; }

        [Required]  //Defino los campos de bundle y libro
        public Bundles Bundle { get; set; }
    }

    public class Bundle_Pedido //Creo los atributos de los paquetes de los pedidos según los datos que se van a pedir en el formulario de registro y los que formulan en nuestra BBDD
    {
        [Key]   //Defino la clave primaria
        public int IdBundlePedido { get; set; }

        [Required]  //Defino los campos de bundle y pedido
        public Bundles Bundle { get; set; }
    }

    public class Cesta //Creo los atributos de la cesta según los datos que se van a pedir en el formulario de registro y los que formulan en nuestra BBDD
    {
        [Key]   //Defino la clave primaria
        public int IdCesta { get; set; }

        [Required]  //Defino los campos de usuario y libros
        public User Usuario { get; set; }

        [Required]
        public List<Productos> Productos { get; set; } // Defino la lista de libros

        // Constructor para inicializar la lista de libros
        public Cesta()
        {
            Productos = new List<Productos>();
        }
    }
}
