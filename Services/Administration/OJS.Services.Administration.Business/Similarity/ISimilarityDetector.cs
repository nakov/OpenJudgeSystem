namespace OJS.Services.Administration.Business.Similarity;

using OJS.Services.Administration.Models.Similarity;
using OJS.Services.Infrastructure;
using System.Collections.Generic;

public interface ISimilarityDetector : IService
{
    SimilarityResult DetectPlagiarism(
        string firstSource,
        string secondSource,
        IEnumerable<IDetectSimilarityVisitor>? visitors = null);
}