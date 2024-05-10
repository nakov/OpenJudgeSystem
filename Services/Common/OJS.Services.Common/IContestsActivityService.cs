namespace OJS.Services.Common;

using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestsActivityService : IService
{
    Task<IContestActivityServiceModel> GetContestActivity(int id);

    IContestActivityServiceModel GetContestActivity(IContestForActivityServiceModel contest);

    ParticipantActivityServiceModel GetParticipantActivity(ParticipantForActivityServiceModel participant);

    Task<bool> IsContestActive(IContestForActivityServiceModel contest);

    Task<bool> IsContestActive(int contestId);

    Task SetCanBeCompetedAndPracticed<T>(T contestModel)
        where T : class, ICanBeCompetedAndPracticed;

    Task SetCanBeCompetedAndPracticed<T>(ICollection<T> contestModels)
        where T : class, ICanBeCompetedAndPracticed;
}