namespace OJS.Services.Administration.Business
{
    using System.Threading.Tasks;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Models;
    using SoftUni.Services.Infrastructure;

    public interface IProblemsBusinessService : IService
    {
        Task RetestById(int id);

        Task DeleteById(int id);

        Task DeleteByContest(int contestId);

        Task<ServiceResult> CopyToContestByIdByContestAndProblemGroup(int id, int contestId, int? problemGroupId);

        Task<bool> UserHasProblemPermissions(int problemId, string? userId, bool isUserAdmin);

        Task ReevaluateProblemsByOrderBy(int contestId, Problem problem);
    }
}