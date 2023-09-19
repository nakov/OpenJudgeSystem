namespace OJS.Services.Administration.Business.Implementations
{
    using System.Linq;
    using System.Threading.Tasks;
    using System.Transactions;
    using FluentExtensions.Extensions;
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Helpers;
    using OJS.Data.Models.Problems;
    using OJS.Services.Administration.Data;
    using OJS.Services.Administration.Models.Contests.Problems;
    using OJS.Services.Common;
    using OJS.Services.Common.Data;
    using OJS.Services.Common.Models;
    using OJS.Services.Common.Models.Submissions.ExecutionContext;
    using OJS.Services.Infrastructure.Exceptions;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using IsolationLevel = System.Transactions.IsolationLevel;
    using Resource = OJS.Common.Resources.ProblemsBusiness;
    using SharedResource = OJS.Common.Resources.ContestsGeneral;

    public class ProblemsBusinessService : IProblemsBusinessService
    {
        private readonly IContestsDataService contestsData;
        private readonly IParticipantScoresDataService participantScoresData;
        private readonly IProblemsDataService problemsData;
        private readonly IProblemResourcesDataService problemResourcesData;
        private readonly ISubmissionsDataService submissionsData;
        private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingData;
        private readonly ITestRunsDataService testRunsData;
        private readonly ISubmissionTypesDataService submissionTypesData;
        private readonly IProblemGroupsBusinessService problemGroupsBusiness;
        private readonly IContestsBusinessService contestsBusiness;
        private readonly ISubmissionsCommonBusinessService submissionsCommonBusinessService;
        public ProblemsBusinessService(
            IContestsDataService contestsData,
            IParticipantScoresDataService participantScoresData,
            IProblemsDataService problemsData,
            IProblemResourcesDataService problemResourcesData,
            ISubmissionsDataService submissionsData,
            ISubmissionsForProcessingCommonDataService submissionsForProcessingData,
            ITestRunsDataService testRunsData,
            ISubmissionTypesDataService submissionTypesData,
            IProblemGroupsBusinessService problemGroupsBusiness,
            IContestsBusinessService contestsBusiness,
            ISubmissionsCommonBusinessService submissionsCommonBusinessService)
        {
            this.contestsData = contestsData;
            this.participantScoresData = participantScoresData;
            this.problemsData = problemsData;
            this.problemResourcesData = problemResourcesData;
            this.submissionsData = submissionsData;
            this.submissionsForProcessingData = submissionsForProcessingData;
            this.testRunsData = testRunsData;
            this.submissionTypesData = submissionTypesData;
            this.problemGroupsBusiness = problemGroupsBusiness;
            this.contestsBusiness = contestsBusiness;
            this.submissionsCommonBusinessService = submissionsCommonBusinessService;
        }

        public async Task DeleteById(int id)
        {
            var problem = this.problemsData
                .GetByIdQuery(id)
                .Select(p => new { p.ProblemGroupId, p.ProblemGroup.ContestId, p.IsDeleted, })
                .FirstOrDefault();

            if (problem == null || problem.IsDeleted)
            {
                return;
            }

            using var scope = TransactionsHelper.CreateTransactionScope(
                IsolationLevel.RepeatableRead,
                TransactionScopeAsyncFlowOption.Enabled);
            if (!await this.contestsData.IsOnlineById(problem.ContestId))
            {
                await this.problemGroupsBusiness.DeleteById(problem.ProblemGroupId);
            }

            await this.problemsData.DeleteById(id);
            await this.problemsData.SaveChanges();
            await this.testRunsData.DeleteByProblem(id);

            this.problemResourcesData.DeleteByProblem(id);

            this.submissionsData.DeleteByProblem(id);

            scope.Complete();
        }

        public async Task DeleteByContest(int contestId) =>
            await this.problemsData
                .GetAllByContest(contestId)
                .Select(p => p.Id)
                .ToList()
                .ForEachSequential(async id => await this.DeleteById(id));

        public async Task<ServiceResult> CopyToContestByIdByContestAndProblemGroup(int id, int contestId, int? problemGroupId)
        {
            var problem = await this.problemsData
                .GetByIdQuery(id)
                .AsNoTracking()
                .Include(p => p.Tests)
                .Include(p => p.Resources)
                .Include(p => p.ProblemGroup)
                .SingleOrDefaultAsync();

            if (problem?.ProblemGroup.ContestId == contestId)
            {
                return new ServiceResult(Resource.CannotCopyProblemsIntoSameContest);
            }

            if (!await this.contestsData.ExistsById(contestId))
            {
                return new ServiceResult(SharedResource.ContestNotFound);
            }

            if (await this.contestsData.IsActiveById(contestId))
            {
                return new ServiceResult(Resource.CannotCopyProblemsIntoActiveContest);
            }

            await this.CopyProblemToContest(problem, contestId, problemGroupId);

            return ServiceResult.Success;
        }

        public async Task<bool> UserHasProblemPermissions(int problemId, string? userId, bool isUserAdmin)
        {
            var problem = await this.problemsData.OneByIdTo<ProblemShortDetailsServiceModel>(problemId);

            if (problem == null)
            {
                throw new BusinessServiceException("Problem cannot be null");
            }

            return await this.contestsBusiness.UserHasContestPermissions(problem.ContestId, userId, isUserAdmin);
        }

        public Task ReevaluateProblemsOrder(int contestId, Problem problem)
            => this.problemGroupsBusiness.ReevaluateProblemsAndProblemGroupsOrder(contestId, problem.ProblemGroup);

        public async Task RetestById(int problemId)
        {
            var submissions = await this.submissionsData.GetAllNonDeletedByProblemId<SubmissionServiceModel>(problemId);

            var submissionIds = submissions.Select(s => s.Id).ToList();

            using (var scope = TransactionsHelper.CreateTransactionScope(
                       IsolationLevel.RepeatableRead,
                       TransactionScopeAsyncFlowOption.Enabled))
            {
                await this.participantScoresData.DeleteAllByProblem(problemId);
                await this.submissionsData.SetAllToUnprocessedByProblem(problemId);
                await this.submissionsForProcessingData.AddOrUpdateBySubmissionIds(submissionIds);

                scope.Complete();
            }

            await submissions.ForEachSequential(async s =>
            {
                await this.testRunsData.DeleteBySubmission(s.Id);

                await this.submissionsCommonBusinessService.PublishSubmissionForProcessing(s);
            });
        }

        private async Task CopyProblemToContest(Problem? problem, int contestId, int? problemGroupId)
        {
            double orderBy;

            if (problem == null)
            {
                return;
            }

            if (problemGroupId.HasValue)
            {
                orderBy = await this.problemsData.GetNewOrderByProblemGroup(problemGroupId.Value);

                problem.ProblemGroup = null!;
                problem.ProblemGroupId = problemGroupId.Value;
            }
            else
            {
                orderBy = await this.problemsData.GetNewOrderByContest(contestId);

                problem.ProblemGroup = new ProblemGroup
                {
                    ContestId = contestId,
                    OrderBy = orderBy,
                };
            }

            problem.OrderBy = orderBy;
            problem.SubmissionTypesInProblems = await this.submissionTypesData
                .GetAllByProblem(problem.Id)
                .Include(x => x.SubmissionTypesInProblems)
                .SelectMany(x => x.SubmissionTypesInProblems)
                .ToListAsync();

            await this.problemsData.Add(problem);
            await this.problemsData.SaveChanges();
        }
    }
}