namespace OJS.Services.Administration.Business.Similarity;

using OJS.Services.Administration.Models.Contests;
using OJS.Services.Administration.Models.Similarity;
using OJS.Services.Infrastructure;
using System.Collections.Generic;

public interface ISimilarityService : IService
{
    IEnumerable<SubmissionSimilarityViewModel> GetSubmissionSimilarities(SimillarityCheckModel model);
}