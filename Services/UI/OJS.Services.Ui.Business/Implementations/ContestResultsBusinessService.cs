namespace OJS.Services.Ui.Business.Implementations;

using Data;
using Infrastructure.Exceptions;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests.Results;
using System.Threading.Tasks;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;

public class ContestResultsBusinessService : IContestResultsBusinessService
{
    private readonly IContestResultsAggregatorService contestResultsAggregator;
    private readonly IContestsDataService contestsData;
    private readonly IContestResultsValidationService contestResultsValidation;
    private readonly IUserProviderService userProvider;

    public ContestResultsBusinessService(
        IContestResultsAggregatorService contestResultsAggregator,
        IContestsDataService contestsData,
        IContestResultsValidationService contestResultsValidation,
        IUserProviderService userProvider)
    {
        this.contestResultsAggregator = contestResultsAggregator;
        this.contestsData = contestsData;
        this.contestResultsValidation = contestResultsValidation;
        this.userProvider = userProvider;
        this.contestsData.DisableLazyLoading();
    }

    public async Task<ContestResultsViewModel> GetContestResults(int contestId, bool official, bool full)
    {
        var contest = await this.contestsData.GetByIdWithProblems(contestId);

        var validationResult = this.contestResultsValidation.GetValidationResult((contest, full));

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var user = this.userProvider.GetCurrentUser();

        return this.contestResultsAggregator.GetContestResults(
            contest!,
            official,
            user.IsAdminOrLecturer,
            full);
    }
}