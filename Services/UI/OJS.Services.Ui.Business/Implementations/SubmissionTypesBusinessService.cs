namespace OJS.Services.Ui.Business.Implementations;

using OJS.Services.Ui.Models.Submissions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.SubmissionTypes;

public class SubmissionTypesBusinessService : ISubmissionTypesBusinessService
{
    private const int LatestSubmissionsCountForSubmissionTypesUsage = 10_000;
    private readonly ISubmissionTypesDataService submissionTypesData;
    private readonly ISubmissionsDataService submissionsData;

    public SubmissionTypesBusinessService(
        ISubmissionTypesDataService submissionTypesData,
        ISubmissionsDataService submissionsData)
    {
        this.submissionTypesData = submissionTypesData;
        this.submissionsData = submissionsData;
    }

    public async Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllOrderedByLatestUsage()
    {
        var latestSubmissions = await this.submissionsData
            .GetLatestSubmissions<SubmissionForSubmissionTypesFilterServiceModel>(
                LatestSubmissionsCountForSubmissionTypesUsage)
            .ToListAsync();

        var allSubmissionTypes = await this.submissionTypesData
            .AllTo<SubmissionTypeFilterServiceModel>()
            .ToListAsync();

        var submissionTypesUsageGroups = latestSubmissions
            .GroupBy(x => x.SubmissionTypeId)
            .Where(x => x.Key.HasValue)
            .ToDictionary(x => x.Key!.Value, x => x.Count());

        return allSubmissionTypes
            .OrderByDescending(x => submissionTypesUsageGroups.GetValueOrDefault(x.Id));
    }
}