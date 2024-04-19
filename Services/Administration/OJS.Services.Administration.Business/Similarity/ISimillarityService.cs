namespace OJS.Services.Administration.Business.Similarity;

using OJS.Services.Administration.Models.Contests;
using SoftUni.Services.Infrastructure;

public interface ISimilarityService : IService
{
    void GetSubmissionSimilarities(SimillarityCheckModel model);
}