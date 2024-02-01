namespace OJS.Services.Administration.Business
{
    using System.Threading.Tasks;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Models;
    using SoftUni.Services.Infrastructure;
    using OJS.Services.Common.Data.Pagination;

    public interface IProblemGroupsBusinessService : IGridDataService<ProblemGroup>, IService
    {
        Task<ServiceResult> DeleteById(int id);

        Task<ServiceResult> CopyAllToContestBySourceAndDestinationContest(
            int sourceContestId,
            int destinationContestId);

        Task ReevaluateProblemsAndProblemGroupsOrder(int contestId, ProblemGroup problemGroup);
    }
}