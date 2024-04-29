namespace OJS.Services.Administration.Business.Similarity.SimilarityDetector;

using SoftUni.Services.Infrastructure;

public interface ISimilarityDetectorFactory : IService
{
    ISimilarityDetector CreatePlagiarismDetector(SimilarityDetectorCreationContext context);
}