namespace OJS.Services.Ui.Business.Implementations;

using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Statistics;
using System.Threading.Tasks;

public class StatisticsPreviewBusinessService : IStatisticsPreviewBusinessService
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
            ContestsCount = await this.contestsData.Count(),
            UsersCount = await this.usersProfileData.Count(),
            ProblemsCount = await this.problemsData.Count(),
            SubmissionsCount = await this.submissionsData.Count(),
            StrategiesCount = await this.submissionTypesData.Count(),
            SubmissionsPerDayCount = await this.submissionsData.GetSubmissionsPerDayCount(),
        };
}