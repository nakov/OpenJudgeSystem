namespace OJS.Services.Administration.Business.ProblemGroups
{
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Models;
    using System.Threading.Tasks;
    using OJS.Services.Administration.Models.ProblemGroups;

    public interface IProblemGroupsBusinessService : IAdministrationOperationService<ProblemGroup, int, ProblemGroupsAdministrationModel>
    {
        Task<ServiceResult> DeleteById(int id);

        Task<ServiceResult> CopyAllToContestBySourceAndDestinationContest(
            int sourceContestId,
            int destinationContestId);

        Task ReevaluateProblemsAndProblemGroupsOrder(int contestId, ProblemGroup problemGroup);
    }
}