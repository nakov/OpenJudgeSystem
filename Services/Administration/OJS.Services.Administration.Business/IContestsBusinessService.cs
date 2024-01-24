namespace OJS.Services.Administration.Business;

using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data.Pagination;
using SoftUni.Services.Infrastructure;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Administration.Models.Problems;

public interface IContestsBusinessService : IGridDataService<Contest>, IService
{
    Task<bool> UserHasContestPermissions(int contestId, string? userId, bool isUserAdmin);

    Task<IEnumerable<TServiceModel>> GetAllAvailableForCurrentUser<TServiceModel>()
        where TServiceModel : class;

    Task<ContestAdministrationModel> ById(int id);

    Task Edit(ContestAdministrationModel model, int id);

    Task Delete(int id);

    Task Create(ContestAdministrationModel model);
}