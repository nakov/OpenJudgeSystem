namespace OJS.Services.Common;

using OJS.Services.Common.Models.Contests;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IContestsActivityService : IService
{
    Task<IContestActivityServiceModel> GetContestActivity(int id);

    Task<IContestActivityServiceModel> GetContestActivity(IContestForActivityServiceModel model);

    bool CanBeCompeted(IContestForActivityServiceModel contest);

    bool CanBePracticed(IContestForActivityServiceModel contest);

    Task<bool> IsActive(IContestForActivityServiceModel contest);
}