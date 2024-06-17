namespace OJS.Services.Administration.Business.Similarity;

using OJS.Services.Administration.Models.Contests;
using OJS.Services.Administration.Models.Similarity;
using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ISimilarityService : IService
{
    Task<Dictionary<string, IEnumerable<SubmissionSimilarityViewModel?>>> GetSubmissionSimilarities(SimillarityCheckModel model);
}