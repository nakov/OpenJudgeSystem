namespace OJS.Services.Administration.Business.Contests;

using OJS.Services.Administration.Models.Contests;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Data.Models.Contests;

public interface IContestsBusinessService : IAdministrationOperationService<Contest, int, ContestAdministrationModel>
{
    Task<bool> UserHasContestPermissions(int contestId, string? userId, bool isUserAdmin);

    Task<IEnumerable<TServiceModel>> GetAllAvailableForCurrentUser<TServiceModel>(string searchString)
        where TServiceModel : class;
}