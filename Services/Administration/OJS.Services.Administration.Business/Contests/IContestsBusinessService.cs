namespace OJS.Services.Administration.Business.Contests;

using OJS.Services.Administration.Models.Contests;
using SoftUni.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestsBusinessService : IService
{
    Task<bool> UserHasContestPermissions(int contestId, string? userId, bool isUserAdmin);

    Task<IEnumerable<TServiceModel>> GetAllAvailableForCurrentUser<TServiceModel>(string searchString)
        where TServiceModel : class;

    Task<ContestAdministrationModel> ById(int id);

    Task Edit(ContestAdministrationModel model, int id);

    Task Delete(int id);

    Task Create(ContestAdministrationModel model);
}