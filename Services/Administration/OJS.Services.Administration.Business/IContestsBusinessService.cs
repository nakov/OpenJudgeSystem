namespace OJS.Services.Administration.Business;

using OJS.Data.Models.Contests;
using SoftUni.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestsBusinessService : IService
{
    Task<bool> UserHasContestPermissions(Contest contest, string? userId, bool isUserAdmin);

    Task<bool> UserHasContestPermissions(int contestId, int? categoryId, string? userId, bool isUserAdmin);

    Task<IEnumerable<TServiceModel>> GetAllAvailableForCurrentUser<TServiceModel>()
        where TServiceModel : class;
}