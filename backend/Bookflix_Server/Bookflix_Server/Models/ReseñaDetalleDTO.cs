public class ReseñaDetalleDTO
{
    public int IdReseña { get; set; }
    public int UsuarioId { get; set; }
    public int ProductoId { get; set; }
    public string Autor { get; set; }
    public string Texto { get; set; }
    public int Estrellas { get; set; }
    public DateTime FechaPublicacion { get; set; }
    public string Categoria { get; set; }
}
