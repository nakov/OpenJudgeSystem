namespace OJS.Services.Administration.Business.Implementations
{
    using FluentExtensions.Extensions;
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models.Problems;
    using OJS.Services.Administration.Data;
    using OJS.Services.Common.Models;
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

        public async Task<ServiceResult> CopyAllToContestBySourceAndDestinationContest(
            int sourceContestId,
            int destinationContestId)
        {
            if (sourceContestId == destinationContestId)
            {
                return new ServiceResult(Resource.CannotCopyProblemGroupsIntoSameContest);
            }

            if (!await this.contestsData.ExistsById(destinationContestId))
            {
                return new ServiceResult(SharedResource.ContestNotFound);
            }

            if (await this.contestsData.IsActiveById(destinationContestId))
            {
                return new ServiceResult(Resource.CannotCopyProblemGroupsIntoActiveContest);
            }

            var sourceContestProblemGroups = await this.problemGroupsData
                .GetAllByContest(sourceContestId)
                .AsNoTracking()
                .Include(pg => pg.Problems.Select(p => p.Tests))
                .Include(pg => pg.Problems.Select(p => p.Resources))
                .ToListAsync();

            await sourceContestProblemGroups
                .ForEachSequential(async pg => await this.CopyProblemGroupToContest(pg, destinationContestId));

            return ServiceResult.Success;
        }

        private async Task CopyProblemGroupToContest(ProblemGroup problemGroup, int contestId)
        {
            problemGroup.Contest = null!;
            problemGroup.ContestId = contestId;

            await problemGroup.Problems
                .ForEachAsync(async p => p.SubmissionTypesInProblems = await this.submissionTypesData
                    .GetAllByProblem(p.Id)
                    .Include(x => x.SubmissionTypesInProblems)
                    .SelectMany(x => x.SubmissionTypesInProblems)
                    .ToListAsync());

            await this.problemGroupsData.Add(problemGroup);
            await this.problemGroupsData.SaveChanges();
        }
    }
}