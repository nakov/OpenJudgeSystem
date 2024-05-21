namespace OJS.Services.Ui.Business.Implementations
{
    using System.Linq;
    using System.Threading.Tasks;
    using System.Transactions;
    using FluentExtensions.Extensions;
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Helpers;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data;
    using OJS.Services.Infrastructure;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Search;
    using OJS.Services.Infrastructure.Extensions;
    using X.PagedList;
    using IsolationLevel = System.Transactions.IsolationLevel;

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
        private readonly ILecturersInContestsBusinessService lecturersInContestsBusinessService;
        private readonly IDatesService dates;

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
            ILecturersInContestsBusinessService lecturersInContestsBusinessService,
            IDatesService dates)
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
            this.lecturersInContestsBusinessService = lecturersInContestsBusinessService;
            this.dates = dates;
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

        public async Task<ProblemSearchServiceResultModel> GetSearchProblemsByName(SearchServiceModel model)
        {
            var modelResult = new ProblemSearchServiceResultModel();

            var allProblemsQueryable = this.problemsData
                .GetAllNonDeletedProblems()
                .Include(p => p.ProblemGroup)
                    .ThenInclude(pg => pg.Contest)
                    .ThenInclude(c => c.Category)
                .Where(p => p.Name.Contains(model.SearchTerm ?? string.Empty) &&
                            (p.ProblemGroup.Contest.IsVisible || p.ProblemGroup.Contest.VisibleFrom < this.dates.GetUtcNow()) &&
                            (p.ProblemGroup.Contest.Category != null &&
                             p.ProblemGroup.Contest.Category.IsVisible));

            var searchProblems = await allProblemsQueryable
                .MapCollection<ProblemSearchServiceModel>()
                .ToPagedListAsync(model.PageNumber, model.ItemsPerPage);

            modelResult.Problems = searchProblems;
            modelResult.TotalProblemsCount = allProblemsQueryable.Count();

            return modelResult;
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