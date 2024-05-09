namespace OJS.Services.Common;

using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure;
using System.Threading.Tasks;

public interface IContestsActivityService : IService
{
    Task<IContestActivityServiceModel> GetContestActivity(int id);

    IContestActivityServiceModel GetContestActivity(IContestForActivityServiceModel contest);

    ParticipantActivityServiceModel GetParticipantActivity(ParticipantForActivityServiceModel participant);

    Task<bool> IsContestActive(IContestForActivityServiceModel contest);

    Task<bool> IsContestActive(int contestId);

    void SetCanBeCompetedAndPracticed<T>(T contestModel)
        where T : ICanBeCompetedAndPracticed;
}