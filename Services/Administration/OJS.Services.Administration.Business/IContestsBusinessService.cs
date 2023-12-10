namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Pagination;
using OJS.Services.Administration.Models.Contests;

public interface IContestsBusinessService : IService
{
    Task<bool> UserHasContestPermissions(int contestId, string? userId, bool isUserAdmin);

    Task<IEnumerable<TServiceModel>> GetAllAvailableForCurrentUser<TServiceModel>()
        where TServiceModel : class;

    Task<PaginatedList<ContestInListModel>> GetAllContests(PaginationModel<Contest> paginationModel);
}