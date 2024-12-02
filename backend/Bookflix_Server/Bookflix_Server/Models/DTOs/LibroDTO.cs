namespace Bookflix_Server.Models.DTOs
{
    public class LibroDTO
    {
        public int IdLibro { get; set; }
        public string Nombre { get; set; }

        public string Autor { get; set; }

        public int Precio { get; set; }

        public string UrlImagen { get; set; }

        public string Genero { get; set; }

        public string Descripcion { get; set; }

        public string ISBN { get; set; }

        public int Stock { get; set; }

        public double PromedioEstrellas { get; set; }
    }
}
