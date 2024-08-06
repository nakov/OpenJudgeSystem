namespace OJS.Services.Administration.Business;

using OJS.Services.Infrastructure;
using System.Threading.Tasks;

public interface IContestsCacheService : IService
{
    Task ClearContestsCacheByContestId(int contestId);
}