public class CompraDTO
{
    public int IdCompra { get; set; }
    public DateTime FechaCompra { get; set; }
    public List<CompraDetalleDTO> Detalles { get; set; }
}

public class CompraDetalleDTO
{
    public int IdLibro { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
}