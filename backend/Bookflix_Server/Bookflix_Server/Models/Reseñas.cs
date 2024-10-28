using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bookflix_Server.Models
{
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
}
