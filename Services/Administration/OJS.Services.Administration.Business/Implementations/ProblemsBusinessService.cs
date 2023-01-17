namespace OJS.Services.Administration.Business.Implementations
{
    using FluentExtensions.Extensions;
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Helpers;
    using OJS.Data.Models.Problems;
    using OJS.Services.Administration.Data;
    using OJS.Services.Administration.Models.Contests.Problems;
    using OJS.Services.Common;
    using OJS.Services.Common.Models;
    using OJS.Services.Infrastructure.Exceptions;
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Transactions;
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
        private readonly ISubmissionsForProcessingDataService submissionsForProcessingData;
        private readonly ITestRunsDataService testRunsData;
        private readonly ISubmissionTypesDataService submissionTypesData;
        private readonly IProblemGroupsBusinessService problemGroupsBusiness;
        private readonly ISubmissionsDistributorCommunicationService submissionsDistributorCommunication;
        private readonly IContestsBusinessService contestsBusiness;

        public ProblemsBusinessService(
            IContestsDataService contestsData,
            IParticipantScoresDataService participantScoresData,
            IProblemsDataService problemsData,
            IProblemResourcesDataService problemResourcesData,
            ISubmissionsDataService submissionsData,
            ISubmissionsForProcessingDataService submissionsForProcessingData,
            ITestRunsDataService testRunsData,
            ISubmissionTypesDataService submissionTypesData,
            IProblemGroupsBusinessService problemGroupsBusiness,
            ISubmissionsDistributorCommunicationService submissionsDistributorCommunication,
            IContestsBusinessService contestsBusiness)
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
            this.submissionsDistributorCommunication = submissionsDistributorCommunication;
            this.contestsBusiness = contestsBusiness;
        }

        public async Task RetestById(int id)
        {
            var submissions = await this.submissionsData.GetAllByProblem(id)
                .Include(s => s.SubmissionType)
                .Include(s => s.Problem)
                .Include(s => s.Problem!.Checker)
                .Include(s => s.Problem!.Tests)
                .ToListAsync();

            var submissionIds = submissions.Select(s => s.Id).ToList();

            using (var scope = TransactionsHelper.CreateTransactionScope(
                       IsolationLevel.RepeatableRead,
                       TransactionScopeAsyncFlowOption.Enabled))
            {
                await this.participantScoresData.DeleteAllByProblem(id);

                this.submissionsData.SetAllToUnprocessedByProblem(id);

                await this.submissionsForProcessingData.AddOrUpdateBySubmissionIds(submissionIds);

                scope.Complete();
            }

            var response = await this.submissionsDistributorCommunication.AddSubmissionsForProcessing(submissions);
            if (!response.IsSuccess)
            {
                throw new Exception(
                    "An error has occured while sending submissions for processing: " + response.ErrorMessage);
            }
        }

        public async Task DeleteById(int id)
        {
            var problem = this.problemsData
                .GetByIdQuery(id)
                .Select(p => new
                {
                    p.ProblemGroupId,
                    p.ProblemGroup.ContestId,
                })
                .FirstOrDefault();

            if (problem == null)
            {
                return;
            }

            using (var scope = TransactionsHelper.CreateTransactionScope(
                       IsolationLevel.RepeatableRead,
                       TransactionScopeAsyncFlowOption.Enabled))
            {
                await this.testRunsData.DeleteByProblem(id);

                this.problemResourcesData.DeleteByProblem(id);

                this.submissionsData.DeleteByProblem(id);

                await this.problemsData.DeleteById(id);
                await this.problemsData.SaveChanges();

                if (!await this.contestsData.IsOnlineById(problem.ContestId))
                {
                    await this.problemGroupsBusiness.DeleteById(problem.ProblemGroupId);
                }

                scope.Complete();
            }
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