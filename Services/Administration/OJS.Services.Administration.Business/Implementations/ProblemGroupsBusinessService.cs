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
        private readonly ISubmissionTypesInProblemsDataService submissionTypesInProblemsData;
        private readonly IOrderableService<ProblemGroup> problemGroupsOrderableService;
        private readonly IOrderableService<Problem> problemsOrderableService;

        public ProblemGroupsBusinessService(
            IProblemGroupsDataService problemGroupsData,
            IContestsDataService contestsData,
            ISubmissionTypesInProblemsDataService submissionTypesInProblemsData,
            IOrderableService<Problem> problemsOrderableService,
            IOrderableService<ProblemGroup> problemGroupsOrderableService)
        {
            this.problemGroupsData = problemGroupsData;
            this.contestsData = contestsData;
            this.submissionTypesInProblemsData = submissionTypesInProblemsData;
            this.problemsOrderableService = problemsOrderableService;
            this.problemGroupsOrderableService = problemGroupsOrderableService;
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
                .Include(pg => pg.Problems)
                    .ThenInclude(p => p.Tests)
                .Include(pg => pg.Problems)
                    .ThenInclude(p => p.Resources)
                .ToListAsync();

            await sourceContestProblemGroups
                .ForEachSequential(async pg => await this.CopyProblemGroupToContest(pg, destinationContestId));

            return ServiceResult.Success;
        }

        public async Task ReevaluateProblemsAndProblemGroupsOrder(int contestId, ProblemGroup problemGroup)
        {
            var problemGroups = this.problemGroupsData.GetAllByContestId(contestId);

            await this.problemGroupsOrderableService.ReevaluateOrder(problemGroups);

            // We detach the existing entity, in order to avoid tracking exception on Update.
            if (problemGroup != null)
            {
                this.problemGroupsData.Detach(problemGroup);
            }

            var problems = problemGroups.SelectMany(p => p.Problems)
                .Where(p => !p.IsDeleted);

            await this.problemsOrderableService.ReevaluateOrder(problems);
        }

        private async Task CopyProblemGroupToContest(ProblemGroup problemGroup, int contestId)
        {
            var currentNewProblemGroup = new ProblemGroup
            {
                ContestId = contestId,
                OrderBy = problemGroup.OrderBy,
                Type = problemGroup.Type,
            };

            problemGroup.Problems
                .ForEach(problem =>
                {
                    var submissionTypeInProblems = this.submissionTypesInProblemsData
                        .GetAllByProblem(problem.Id)
                        .AsNoTracking()
                        .ToList();

                    var currentNewProblem = new Problem
                    {
                        Name = problem.Name,
                        MaximumPoints = problem.MaximumPoints,
                        TimeLimit = problem.TimeLimit,
                        MemoryLimit = problem.MemoryLimit,
                        SourceCodeSizeLimit = problem.SourceCodeSizeLimit,
                        CheckerId = problem.CheckerId,
                        SolutionSkeleton = problem.SolutionSkeleton,
                        AdditionalFiles = problem.AdditionalFiles,
                        ShowResults = problem.ShowResults,
                        ShowDetailedFeedback = problem.ShowDetailedFeedback,
                        Tests = problem.Tests,
                        Resources = problem.Resources,
                        Submissions = problem.Submissions,
                        TagsInProblems = problem.TagsInProblems,
                        ParticipantScores = problem.ParticipantScores,
                    };

                    currentNewProblem.SubmissionTypesInProblems.AddRange(submissionTypeInProblems);
                    currentNewProblemGroup.Problems.Add(currentNewProblem);
                });

            await this.problemGroupsData.Add(currentNewProblemGroup);
            await this.problemGroupsData.SaveChanges();

            await this.ReevaluateProblemsAndProblemGroupsOrder(contestId, currentNewProblemGroup);
        }
    }
}