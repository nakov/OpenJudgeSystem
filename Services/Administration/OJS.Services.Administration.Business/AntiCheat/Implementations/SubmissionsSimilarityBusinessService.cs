namespace OJS.Services.Administration.Business.AntiCheat.Implementations;

using OJS.Services.Administration.Models.AntiCheat;
using System;
using System.Threading.Tasks;
using static OJS.Common.GlobalConstants.FileExtensions;

public class SubmissionsSimilarityBusinessService : ISubmissionsSimilarityBusinessService
{
    // TODO: implement
    public async Task<(byte[] file, string fileName)> GetSimilaritiesForFiltersCsv(
        SubmissionSimilarityFiltersServiceModel filters)
    {
        var file = await Task.FromResult(Array.Empty<byte>());
        var fileName = $"Result{Csv}";

        return (file, fileName);
    }
}