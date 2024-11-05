using System;
using System.ComponentModel.DataAnnotations;

namespace Bookflix_Server.Models;

// Clase que representa una reseña individual
public class Reseña
{
    [Required]
    public int UsuarioId { get; set; } // Identificador del usuario que escribió la reseña

    [Key]
    public int ProductoId { get; set; } // Identificador del producto al que pertenece la reseña

    [Required]
    public string Autor { get; set; } // Nombre del autor de la reseña

    public string Texto { get; set; } // Texto de la reseña

    [Required]
    public int Estrellas { get; set; } // Número de estrellas otorgadas en la reseña

    public DateTime FechaPublicacion { get; set; } // Fecha de publicación de la reseña
}
