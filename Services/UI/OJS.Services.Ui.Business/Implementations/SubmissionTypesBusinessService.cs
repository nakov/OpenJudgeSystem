namespace OJS.Services.Ui.Business.Implementations;

using OJS.Services.Ui.Models.Submissions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Common.Models.Cache;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.SubmissionTypes;

public class SubmissionTypesBusinessService : ISubmissionTypesBusinessService
{
    private const int LatestSubmissionsCountForSubmissionTypesUsage = 10_000;
    private readonly ISubmissionTypesDataService submissionTypesData;
    private readonly ISubmissionsDataService submissionsData;
    private readonly IContestCategoriesBusinessService contestCategoriesBusiness;
    private readonly IContestCategoriesDataService contestCategoriesData;

    public SubmissionTypesBusinessService(
        ISubmissionTypesDataService submissionTypesData,
        ISubmissionsDataService submissionsData,
        IContestCategoriesBusinessService contestCategoriesBusiness,
        IContestCategoriesDataService contestCategoriesData)
    {
        this.submissionTypesData = submissionTypesData;
        this.submissionsData = submissionsData;
        this.contestCategoriesBusiness = contestCategoriesBusiness;
        this.contestCategoriesData = contestCategoriesData;
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

    public async Task<IEnumerable<AllowedContestStrategiesServiceModel>> GetAllForContestCategory(int contestCategoryId)
    {
        var subcategories = await this.contestCategoriesBusiness.GetAllSubcategories(contestCategoryId);
        var categoryIds = subcategories.Select(x => x.Id).Append(contestCategoryId).ToList();

        return await this.contestCategoriesData
            .GetAllowedStrategyTypesByIds<AllowedContestStrategiesServiceModel>(categoryIds);
    }
}