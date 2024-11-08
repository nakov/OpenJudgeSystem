namespace OJS.Services.Ui.Business.Cache;

using System.Collections.Generic;
using OJS.Services.Ui.Models.Contests;
using OJS.Services.Infrastructure;
using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;

public interface IContestsCacheService : IService
{
    Task<ContestDetailsServiceModel?> GetContestDetailsServiceModel(int contestId);

    Task<ContestServiceModel?> GetContestServiceModel(int contestId);

    Task<Contest?> GetContest(int contestId);

    Task<(Contest? Contest, ICollection<Problem> Problems)> GetContestWithProblems(int contestId);
}