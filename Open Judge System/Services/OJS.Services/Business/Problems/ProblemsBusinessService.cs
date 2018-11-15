﻿namespace OJS.Services.Business.Problems
{
    using System.Data.Entity;
    using System.Linq;

    using OJS.Common.Helpers;
    using OJS.Data.Models;
    using OJS.Data.Repositories.Contracts;
    using OJS.Services.Business.ProblemGroups;
    using OJS.Services.Common;
    using OJS.Services.Data.Contests;
    using OJS.Services.Data.ParticipantScores;
    using OJS.Services.Data.ProblemResources;
    using OJS.Services.Data.Problems;
    using OJS.Services.Data.Submissions;
    using OJS.Services.Data.SubmissionsForProcessing;
    using OJS.Services.Data.SubmissionTypes;
    using OJS.Services.Data.TestRuns;

    using IsolationLevel = System.Transactions.IsolationLevel;
    using Resource = Resources.Services.Problems.ProblemsBusiness;

    public class ProblemsBusinessService : IProblemsBusinessService
    {
        private readonly IEfDeletableEntityRepository<Problem> problems;
        private readonly IContestsDataService contestsData;
        private readonly IParticipantScoresDataService participantScoresData;
        private readonly IProblemsDataService problemsData;
        private readonly IProblemResourcesDataService problemResourcesData;
        private readonly ISubmissionsDataService submissionsData;
        private readonly ISubmissionsForProcessingDataService submissionsForProcessingData;
        private readonly ITestRunsDataService testRunsData;
        private readonly ISubmissionTypesDataService submissionTypesData;
        private readonly IProblemGroupsBusinessService problemGroupsBusiness;

        public ProblemsBusinessService(
            IEfDeletableEntityRepository<Problem> problems,
            IContestsDataService contestsData,
            IParticipantScoresDataService participantScoresData,
            IProblemsDataService problemsData,
            IProblemResourcesDataService problemResourcesData,
            ISubmissionsDataService submissionsData,
            ISubmissionsForProcessingDataService submissionsForProcessingData,
            ITestRunsDataService testRunsData,
            ISubmissionTypesDataService submissionTypesData,
            IProblemGroupsBusinessService problemGroupsBusiness)
        {
            this.problems = problems;
            this.contestsData = contestsData;
            this.participantScoresData = participantScoresData;
            this.problemsData = problemsData;
            this.problemResourcesData = problemResourcesData;
            this.submissionsData = submissionsData;
            this.submissionsForProcessingData = submissionsForProcessingData;
            this.testRunsData = testRunsData;
            this.submissionTypesData = submissionTypesData;
            this.problemGroupsBusiness = problemGroupsBusiness;
        }

        public void RetestById(int id)
        {
            var submissionIds = this.submissionsData.GetIdsByProblem(id).ToList();

            using (var scope = TransactionsHelper.CreateTransactionScope(IsolationLevel.RepeatableRead))
            {
                this.participantScoresData.DeleteAllByProblem(id);

                this.submissionsData.SetAllToUnprocessedByProblem(id);

                this.submissionsForProcessingData.AddOrUpdateBySubmissionIds(submissionIds);

                scope.Complete();
            }
        }

        public void DeleteById(int id)
        {
            var problem = this.problemsData
                .GetByIdQuery(id)
                .Select(p => new
                {
                    p.ProblemGroupId,
                    p.ProblemGroup.ContestId
                })
                .FirstOrDefault();

            if (problem == null)
            {
                return;
            }

            using (var scope = TransactionsHelper.CreateTransactionScope(IsolationLevel.RepeatableRead))
            {
                this.testRunsData.DeleteByProblem(id);

                this.problemResourcesData.DeleteByProblem(id);

                this.submissionsData.DeleteByProblem(id);

                this.problems.Delete(id);
                this.problems.SaveChanges();

                if (!this.contestsData.IsOnlineById(problem.ContestId))
                {
                    this.problemGroupsBusiness.DeleteById(problem.ProblemGroupId);
                }

                scope.Complete();
            }
        }

        public void DeleteByContest(int contestId) =>
            this.problemsData
                .GetAllByContest(contestId)
                .Select(p => p.Id)
                .ToList()
                .ForEach(this.DeleteById);

        public ServiceResult CopyToContestByIdByContestAndProblemGroup(int id, int contestId, int? problemGroupId)
        {
            var problem = this.problemsData
                .GetByIdQuery(id)
                .AsNoTracking()
                .Include(p => p.Tests)
                .Include(p => p.Resources)
                .SingleOrDefault();

            var problemNewOrderBy = problemGroupId.HasValue
                ? this.problemsData.GetNewOrderByProblemGroup(problemGroupId.Value)
                : this.problemsData.GetNewOrderByContest(contestId);

            if (problem?.ProblemGroup.ContestId == contestId)
            {
                return new ServiceResult(Resource.Cannot_copy_problems_into_same_contest);
            }

            if (this.contestsData.IsActiveById(contestId))
            {
                return new ServiceResult(Resource.Cannot_copy_problems_into_active_contest);
            }

            this.CopyToContest(problem, contestId, problemNewOrderBy, problemGroupId);

            return ServiceResult.Success;
        }

        public ServiceResult CopyAllToContestBySourceAndDestinationContest(int fromContestId, int toContestId)
        {
            var sourceContest = this.contestsData.GetById(fromContestId);
            
            

            return ServiceResult.Success;
        }

        private void CopyToContest(Problem problem, int contestId, int newOrderBy, int? problemGroupId)
        {
            if (problemGroupId.HasValue)
            {
                problem.ProblemGroup = null;
                problem.ProblemGroupId = problemGroupId.Value;
            }
            else
            {
                problem.ProblemGroup = new ProblemGroup
                {
                    ContestId = contestId,
                    OrderBy = newOrderBy
                };
            }

            problem.ModifiedOn = null;
            problem.OrderBy = newOrderBy;
            problem.SubmissionTypes = this.submissionTypesData.GetAllByProblem(problem.Id).ToList();

            this.problemsData.Add(problem);
        }
    }
}