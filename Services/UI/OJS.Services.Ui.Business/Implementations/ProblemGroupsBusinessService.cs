namespace OJS.Services.Ui.Business.Implementations
{
    using FluentExtensions.Extensions;
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Models;
    using OJS.Services.Ui.Data;
    using System.Linq;
    using System.Threading.Tasks;
    using Resource = OJS.Common.Resources.ProblemGroupsBusiness;
    using SharedResource = OJS.Common.Resources.ContestsGeneral;

    public class ProblemGroupsBusinessService : IProblemGroupsBusinessService
    {
        private readonly IProblemGroupsDataService problemGroupsData;
        private readonly IContestsDataService contestsData;
        private readonly ISubmissionTypesDataService submissionTypesData;

        public ProblemGroupsBusinessService(
            IProblemGroupsDataService problemGroupsData,
            IContestsDataService contestsData,
            ISubmissionTypesDataService submissionTypesData)
        {
            this.problemGroupsData = problemGroupsData;
            this.contestsData = contestsData;
            this.submissionTypesData = submissionTypesData;
        }

        public async Task<ServiceResult> DeleteById(int id)
        {
            var problemGroup = await this.problemGroupsData.OneById(id);

            if (problemGroup != null)
            {
                if (problemGroup.Problems.Any(p => !p.IsDeleted))
                {
                    return new ServiceResult(Resource.CannotDeleteProblemGroupWithProblems);
                }

                this.problemGroupsData.Delete(problemGroup);
                await this.problemGroupsData.SaveChanges();
            }

            return ServiceResult.Success;
        }

        private async Task CopyProblemGroupToContest(ProblemGroup problemGroup, int contestId)
        {
            problemGroup.Contest = null!;
            problemGroup.ContestId = contestId;

            await problemGroup.Problems
                .ForEachAsync(async p => p.ProblemSubmissionTypeExecutionDetails = await this.submissionTypesData
                    .GetAllByProblem(p.Id)
                    .Include(x => x.ProblemSubmissionTypeExecutionDetails)
                    .SelectMany(x => x.ProblemSubmissionTypeExecutionDetails)
                    .ToListAsync());

            await this.problemGroupsData.Add(problemGroup);
            await this.problemGroupsData.SaveChanges();
        }
    }
}