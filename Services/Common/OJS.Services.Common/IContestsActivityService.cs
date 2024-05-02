namespace OJS.Services.Common;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure;
using System.Threading.Tasks;

public interface IContestsActivityService : IService
{
    Task<IContestActivityServiceModel> GetContestActivity(int id);

    IContestActivityServiceModel GetContestActivity(IContestForActivityServiceModel contest);

    bool CanUserCompete(IContestForActivityServiceModel contest);

    bool CanBePracticed(IContestForActivityServiceModel contest);

    Task<bool> IsContestActive(IContestForActivityServiceModel contest);

    Task<bool> IsContestActive(int contestId);

    void SetCanBeCompetedAndPracticed<T>(T contestModel)
        where T : ICanBeCompetedAndPracticed;
}