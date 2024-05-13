namespace OJS.Services.Common;

using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestsActivityService : IService
{
    Task<IContestActivityServiceModel> GetContestActivity(IContestForActivityServiceModel contest);

    ParticipantActivityServiceModel GetParticipantActivity(IParticipantForActivityServiceModel participant);

    Task<bool> IsContestActive(IContestForActivityServiceModel contest);

    Task<bool> IsContestActive(int contestId);

    Task SetCanBeCompetedAndPracticed<T>(ICollection<T> contestModels)
        where T : class, ICanBeCompetedAndPracticed, IContestForActivityServiceModel;

    void SetCanBeCompetedAndPracticed<T>(
        IReadOnlyCollection<T> contestModels,
        IReadOnlyCollection<IParticipantForActivityServiceModel> participants)
        where T : class, ICanBeCompetedAndPracticed, IContestForActivityServiceModel;
}