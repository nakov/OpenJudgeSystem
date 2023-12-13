namespace OJS.Services.Administration.Business;

using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data.Pagination;
using SoftUni.Services.Infrastructure;
using OJS.Services.Administration.Models.Contests;

public interface IContestsBusinessService : IGridDataService<Contest>, IService
{
    Task<bool> UserHasContestPermissions(int contestId, string? userId, bool isUserAdmin);

    Task<IEnumerable<TServiceModel>> GetAllAvailableForCurrentUser<TServiceModel>()
        where TServiceModel : class;

    Task<ContestResponseModel> ById(int id);
}