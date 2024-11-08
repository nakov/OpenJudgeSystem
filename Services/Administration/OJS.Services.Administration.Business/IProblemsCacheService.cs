namespace OJS.Services.Administration.Business;

using System.Threading.Tasks;

public interface IProblemsCacheService
{
    Task ClearProblemsCacheByContestId(int contestId);
}