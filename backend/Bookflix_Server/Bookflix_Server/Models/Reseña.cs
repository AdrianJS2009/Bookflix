
using System.ComponentModel.DataAnnotations;

namespace Bookflix_Server.Models
{
    public class Reseña
    {
        [Key]
        public int IdReseña { get; set; } 

        [Required]
        public int UsuarioId { get; set; } 

        [Required]
        public int ProductoId { get; set; }

        [Required]
        public string Autor { get; set; } 

        public string Texto { get; set; } 

        [Required]
        public int Estrellas { get; set; } 

        public DateTime FechaPublicacion { get; set; } = DateTime.Now; 

     
        public string Categoria { get; set; }

   
        public Libro Libro { get; set; }
    }
}
