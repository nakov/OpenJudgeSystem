namespace OJS.Services.Ui.Business.Implementations;

using System.Linq;
using System.Threading.Tasks;

using Data;
using Infrastructure.Exceptions;
using OJS.Services.Common.Models.Contests.Results;

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
    }

    public async Task<ContestResultsViewModel> GetContestResults(int contestId, bool official, bool full)
    {
        var contest = await this.contestsData.GetByIdWithProblems(contestId);

        if (contest == null)
        {
            throw new BusinessServiceException("Contest does not exist or is deleted.");
        }

        var validationResult = this.contestResultsValidation.GetValidationResult((contest, full));

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var user = this.userProvider.GetCurrentUser();

        var results = this.contestResultsAggregator.GetContestResults(
            contest!,
            official,
            user.IsAdminOrLecturer,
            full);

        var userIsLecturerInContest = contest
            .LecturersInContests
            .FirstOrDefault(lc => lc.LecturerId == user.Id) != null;

        var userIsLecturerInCategory =
            contest
                .Category?
                .LecturersInContestCategories
                .FirstOrDefault(l => l.LecturerId == user.Id) != null;

        results.UserHasContestRights = user.IsAdmin || (userIsLecturerInContest || userIsLecturerInCategory);

        return results;
    }
}