namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Extensions;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Business.Validation;
using OJS.Services.Ui.Data;
using System.Threading.Tasks;

public class ContestResultsController : Controller
{
    private readonly IContestResultsAggregatorService contestResultsAggregator;
    private readonly IContestsDataService contestsData;
    private readonly IContestResultsValidationService contestResultsValidation;

    public ContestResultsController(
        IContestResultsAggregatorService contestResultsAggregator,
        IContestsDataService contestsData,
        IContestResultsValidationService contestResultsValidation)
    {
        this.contestResultsAggregator = contestResultsAggregator;
        this.contestsData = contestsData;
        this.contestResultsValidation = contestResultsValidation;
    }

    public async Task<ContestResultsViewModel> GetResults(int id, bool official, bool full)
    {
        var contest = await this.contestsData.GetByIdWithProblems(id);

        this.contestResultsValidation
            .GetValidationResult((contest, full))
            .VerifyResult();

        var results = this.contestResultsAggregator.GetContestResults(
            contest!,
            official,
            this.User.IsAdminOrLecturer(),
            full);

        return results;
    }
}