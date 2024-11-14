using Bookflix_Server.Services;
using Microsoft.ML;


public class ReseñaClassifierService
{
    private readonly PredictionEngine<ReviewInput, ReviewPrediction> _predictionEngine;

    public ReseñaClassifierService()
    {

        string modelPath = "PruebaIADAW.mlnet";


        var mlContext = new MLContext();


        ITransformer loadedModel;
        using (var stream = new FileStream(modelPath, FileMode.Open, FileAccess.Read, FileShare.Read))
        {
            loadedModel = mlContext.Model.Load(stream, out _);
        }


        _predictionEngine = mlContext.Model.CreatePredictionEngine<ReviewInput, ReviewPrediction>(loadedModel);
    }

    public string ClassifyReview(string text)
    {
        var input = new ReviewInput { Text = text };
        var prediction = _predictionEngine.Predict(input);
        return prediction.PredictedLabel;
    }
}