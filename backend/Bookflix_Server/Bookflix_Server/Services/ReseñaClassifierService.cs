using Microsoft.Extensions.Configuration;
using Microsoft.ML;
using Microsoft.ML.Data;


public class ReseñaClassifierService
{
    private readonly MLContext _mlContext;
    private readonly IConfiguration _configuration;
    private ITransformer _model;

    public ReseñaClassifierService(IConfiguration configuration)
    {
        _mlContext = new MLContext();
        _configuration = configuration;
    }

    public void TrainModel()
    {
        // Obtener la ruta del archivo TSV desde appsettings.json
        string dataPath = _configuration["TsvFilePath"];
        if (string.IsNullOrEmpty(dataPath))
        {
            throw new ArgumentNullException("TsvFilePath", "La ruta del archivo TSV no está configurada en appsettings.json.");
        }

        // Comprobar si el archivo existe
        if (!File.Exists(dataPath))
        {
            throw new FileNotFoundException($"No se encontró el archivo TSV en la ruta especificada: {dataPath}");
        }

        Console.WriteLine("Iniciando el proceso de entrenamiento...");

        // Cargar datos desde el archivo TSV
        var data = _mlContext.Data.LoadFromTextFile<ReseñaInput>(dataPath, hasHeader: true, separatorChar: '\t');
        Console.WriteLine("Datos cargados correctamente.");

        // Definir el pipeline de entrenamiento usando SdcaMaximumEntropy para clasificación multiclase
        var pipeline = _mlContext.Transforms.Text.FeaturizeText("Features", nameof(ReseñaInput.Texto))
            .Append(_mlContext.Transforms.Conversion.MapValueToKey("Label", nameof(ReseñaInput.Categoria)))
            .Append(_mlContext.MulticlassClassification.Trainers.SdcaMaximumEntropy())
            .Append(_mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel", "Label"));

        // Entrenar el modelo
        _model = pipeline.Fit(data);
        Console.WriteLine("Entrenamiento completado.");

        // Guardar el modelo para uso futuro
        _mlContext.Model.Save(_model, data.Schema, "ReseñaClassifierModel.zip");
        Console.WriteLine("Modelo guardado en 'ReseñaClassifierModel.zip'.");

        // Evaluación del modelo
        var testMetrics = _mlContext.MulticlassClassification.Evaluate(_model.Transform(data));
        Console.WriteLine($"Log-loss: {testMetrics.LogLoss}");
        Console.WriteLine($"Per class Log-loss: {string.Join(", ", testMetrics.PerClassLogLoss.Select(ll => ll.ToString()))}");
    }


    public string PredictCategory(string reviewText)
    {
        if (_model == null)
        {
            throw new InvalidOperationException("El modelo no ha sido entrenado. Asegúrate de llamar a TrainModel antes de predecir.");
        }

        var predictionEngine = _mlContext.Model.CreatePredictionEngine<ReseñaInput, ReseñaPrediction>(_model);
        var prediction = predictionEngine.Predict(new ReseñaInput { Texto = reviewText });

        Console.WriteLine($"Predicción para el texto '{reviewText}': {prediction.PredictedCategory}");
        return prediction.PredictedCategory;
    }
}

// Clases de entrada y predicción
public class ReseñaInput
{
    [LoadColumn(0)] public string Texto { get; set; }
    [LoadColumn(1)] public string Categoria { get; set; } 
}

public class ReseñaPrediction
{
    [ColumnName("PredictedLabel")] public string PredictedCategory { get; set; }
}
