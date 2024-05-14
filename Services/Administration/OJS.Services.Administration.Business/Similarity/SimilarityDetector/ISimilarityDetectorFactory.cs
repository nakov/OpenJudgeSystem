namespace OJS.Services.Administration.Business.Similarity.SimilarityDetector;

using OJS.Services.Infrastructure;

public interface ISimilarityDetectorFactory : IService
{
    ISimilarityDetector CreatePlagiarismDetector(SimilarityDetectorCreationContext context);
}