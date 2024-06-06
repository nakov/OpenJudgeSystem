namespace OJS.Services.Ui.Business.Implementations;

using System.Threading.Tasks;

using OJS.Services.Ui.Data;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;

public class ContestResultsBusinessService : IContestResultsBusinessService
{
    private readonly IContestResultsAggregatorCommonService contestResultsAggregator;
    private readonly IContestsDataService contestsData;
    private readonly IContestResultsValidationService contestResultsValidation;
    private readonly ILecturersInContestsBusinessService lecturersInContestsBusinessService;
    private readonly IUserProviderService userProvider;
    private readonly int itemsPerPageCompete = 100;
    private readonly int itemsPerPagePractice = 50;
    public ContestResultsBusinessService(
        IContestResultsAggregatorCommonService contestResultsAggregator,
        IContestsDataService contestsData,
        IContestResultsValidationService contestResultsValidation,
        ILecturersInContestsBusinessService lecturersInContestsBusinessService,
        IParticipantsDataService participantsData,
        IUserProviderService userProvider)
    {
        this.contestResultsAggregator = contestResultsAggregator;
        this.contestsData = contestsData;
        this.contestResultsValidation = contestResultsValidation;
        this.lecturersInContestsBusinessService = lecturersInContestsBusinessService;
        this.userProvider = userProvider;
    }

    public async Task<ContestResultsViewModel> GetContestResults(int contestId, bool official, bool full)
    {
        var contest = await this.contestsData.GetByIdWithProblems(contestId);

        if (contest == null)
        {
            throw new BusinessServiceException("Contest does not exist or is deleted.");
        }

        var validationResult = this.contestResultsValidation.GetValidationResult((contest, full, official));

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var user = this.userProvider.GetCurrentUser();

        var contestResultsModel = new ContestResultsModel
        {
            Contest = contest,
            CategoryId = contest.CategoryId.GetValueOrDefault(),
            Official = official,
            IsUserAdminOrLecturer = user.IsAdminOrLecturer,
            IsFullResults = full,
            TotalResultsCount = null,
            IsExportResults = false,
            ItemsInPage = official ? this.itemsPerPageCompete : this.itemsPerPagePractice,
        };

        var results = this.contestResultsAggregator.GetContestResults(contestResultsModel);

        results.UserIsInRoleForContest = await this.lecturersInContestsBusinessService.IsCurrentUserAdminOrLecturerInContest(contest.Id);

        return results;
    }
}