using System.ComponentModel.DataAnnotations;

namespace Bookflix_Server.Models
{
    public class Reseña
    {
        [Key]
        public int IdReseña { get; set; } // Identificador único de la reseña

        [Required]
        public int UsuarioId { get; set; } // Identificador del usuario que escribió la reseña

        [Required]
        public int ProductoId { get; set; } // Identificador del producto al que pertenece la reseña

        [Required]
        public string Autor { get; set; } // Nombre del autor de la reseña

        public string Texto { get; set; } // Texto de la reseña

        [Required]
        public int Estrellas { get; set; } // Número de estrellas otorgadas en la reseña

        public DateTime FechaPublicacion { get; set; } = DateTime.Now; // Fecha de creación de la reseña

        // Navegación hacia el libro
        public Libro Libro { get; set; }
    }
}
