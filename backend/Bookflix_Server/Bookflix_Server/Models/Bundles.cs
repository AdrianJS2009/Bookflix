using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Bookflix_Server.Models
{
    public class Bundles //Creo los atributos de los paquetes según los datos que se van a pedir en el formulario de registro y los que formulan en nuestra BBDD
    {
        [Key]   //Defino la clave primaria
        public int IdBundle { get; set; }

        [Required]  //Defino los campos de nombre, precio, descripción, libros e ImagenURL
        public string Nombre { get; set; }

        [Required]
        public double Precio { get; set; }

        [Required]
        public string Descripcion { get; set; }

        [Required]
        public string ImagenUrl { get; set; }

        [Required]
        public List<Productos> Productos { get; set; } // Defino la lista de productos

        // Constructor para inicializar la lista de productos
        public Bundles()
        {
            Productos = new List<Productos>();
        }
    }
}