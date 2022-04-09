namespace OJS.Services.Administration.Business.AntiCheat;

using OJS.Services.Administration.Models.AntiCheat;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface ISubmissionsSimilarityBusinessService : IService
{
    Task<(byte[] file, string fileName)> GetSimilaritiesForFiltersCsv(SubmissionSimilarityFiltersServiceModel filters);
}