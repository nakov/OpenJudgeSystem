namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IContestsBusinessService : IService
{
    Task<bool> UserHasContestPermissions(int contestId, string? userId, bool isUserAdmin);
}