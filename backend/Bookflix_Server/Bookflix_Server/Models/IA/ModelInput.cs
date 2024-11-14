using Microsoft.ML.Data;


namespace Bookflix_Server.Models.IA
{
    public class ModelInput
    {
        [LoadColumn(0)]
        [ColumnName("text")]
        public string Text { get; set; }

        [LoadColumn(1)]
        [ColumnName("label")]
        public float Label { get; set; }
    }
}
