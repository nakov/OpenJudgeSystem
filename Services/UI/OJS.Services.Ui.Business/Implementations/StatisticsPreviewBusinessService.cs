namespace OJS.Services.Ui.Business.Implementations;

using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Statistics;
using System.Threading.Tasks;

public class StatisticsPreviewBusinessService
    : IStatisticsPreviewBusinessService
{
    private readonly IContestsDataService contestsData;
    private readonly IUsersProfileDataService usersProfileData;
    private readonly IProblemsDataService problemsData;
    private readonly ISubmissionsDataService submissionsData;
    private readonly ISubmissionTypesDataService submissionTypesData;

    public StatisticsPreviewBusinessService(
        IContestsDataService contestsData,
        IUsersProfileDataService usersProfileData,
        IProblemsDataService problemsData,
        ISubmissionsDataService submissionsData,
        ISubmissionTypesDataService submissionTypesData)
    {
        this.contestsData = contestsData;
        this.usersProfileData = usersProfileData;
        this.problemsData = problemsData;
        this.submissionsData = submissionsData;
        this.submissionTypesData = submissionTypesData;
    }

    public async Task<HomeStatisticsServiceModel> GetForHome()
        => new()
        {
            ContestsCount = await this.contestsData.GetCount(),
            UsersCount = await this.usersProfileData.GetCount(),
            ProblemsCount = await this.problemsData.GetCount(),
            SubmissionsCount = await this.submissionsData.GetCount(),
            StrategiesCount = await this.submissionTypesData.GetCount(),
            SubmissionsPerDayCount = await this.submissionsData.GetSubmissionsPerDayCount(),
        };
}