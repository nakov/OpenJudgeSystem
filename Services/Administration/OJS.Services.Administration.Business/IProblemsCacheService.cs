namespace OJS.Services.Administration.Business;

using System.Threading.Tasks;
using OJS.Services.Infrastructure;

public interface IProblemsCacheService : IService
{
    Task ClearProblemsCacheByContestId(int contestId);
}