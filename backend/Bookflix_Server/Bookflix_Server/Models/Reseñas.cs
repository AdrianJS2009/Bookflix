using System.ComponentModel.DataAnnotations;

    internal class Reseñas
{
    public int IdReseñas { get; set; }

    public Libro Libro { get; set; }

    public int ProductoId { get; set; }

    public string Comentario { get; set; }

    public int Puntuación { get; set; }

    public string Autor {  get; set; }

    public DateTime FechaReseña { get; set; }
}


