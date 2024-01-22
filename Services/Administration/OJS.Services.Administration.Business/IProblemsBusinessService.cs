namespace OJS.Services.Administration.Business
{
    using System.Threading.Tasks;
    using OJS.Data.Models.Problems;
    using OJS.Services.Administration.Models.Problems;
    using OJS.Services.Common.Data.Pagination;
    using OJS.Services.Common.Models;
    using SoftUni.Services.Infrastructure;

    public interface IProblemsBusinessService : IGridDataService<Problem>, IService
    {
        Task RetestById(int id);

        Task DeleteById(int id);

        Task DeleteByContest(int contestId);

        Task<ServiceResult> CopyToContestByIdByContestAndProblemGroup(int id, int contestId, int? problemGroupId);

        Task<bool> UserHasProblemPermissions(int problemId, string? userId, bool isUserAdmin);

        Task ReevaluateProblemsOrder(int contestId, Problem problem);

        Task<ProblemAdministrationModel> ById(int id);
    }
}