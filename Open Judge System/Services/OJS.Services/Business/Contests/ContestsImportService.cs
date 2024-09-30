namespace OJS.Services.Business.Contests
{
    using System.Linq;
    using OJS.Data;
    using OJS.Data.Models;
    using OJS.Services.Business.Contests.Models;

    public class ContestsImportService : IContestsImportService
    {
        private readonly IOjsDbContext dbContext;

        public ContestsImportService(IOjsDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public ContestImportResult ImportContest(Contest contest, int categoryIdToImportTo, bool replace)
        {
            var contestImportedFromId = contest.Id;
            var categoryImportedFromId = contest.CategoryId;

            if (replace)
            {
                // TODO: Implement replacing
            }
            else
            {
                contest = ImportAsNewContest(contest);
            }

            this.TryAddExistingCheckers(contest);
            this.TryAddExistingSubmissionTypes(contest);

            contest.CategoryId = categoryIdToImportTo;
            this.dbContext.Contests.Add(contest);
            this.dbContext.SaveChanges();

            return new ContestImportResult
            {
                IsSuccess = true,
                NewContestId = contest.Id,
                NewCategoryId = categoryIdToImportTo,
                ContestImportedFromId = contestImportedFromId,
                CategoryImportedFromId = categoryImportedFromId,
            };
        }

        private static Contest ImportAsNewContest(Contest contest)
        {
            contest.Id = default;

            foreach (var problemGroup in contest.ProblemGroups)
            {
                problemGroup.Id = default;
                problemGroup.Contest = contest;
                problemGroup.ContestId = contest.Id;

                foreach (var problem in problemGroup.Problems)
                {
                    problem.Id = default;
                    problem.ProblemGroup = problemGroup;
                    problem.ProblemGroupId = problemGroup.Id;

                    foreach (var resource in problem.Resources)
                    {
                        resource.Id = default;
                        resource.Problem = problem;
                        resource.ProblemId = problem.Id;
                    }

                    foreach (var test in problem.Tests)
                    {
                        test.Id = default;
                        test.Problem = problem;
                        test.ProblemId = problem.Id;
                    }
                }
            }

            return contest;
        }

        private void TryAddExistingCheckers(Contest contest)
        {
            var checkerNames = contest.ProblemGroups
                .SelectMany(pg => pg.Problems)
                .Select(p => p.Checker)
                .Select(c => c.Name)
                .Distinct()
                .ToList();

            var existingCheckers = this.dbContext.Checkers
                .Where(c => checkerNames.Contains(c.Name))
                .ToList();

            foreach (var problem in contest.ProblemGroups.SelectMany(pg => pg.Problems))
            {
                problem.CheckerId = existingCheckers.FirstOrDefault(c => c.Name == problem.Checker?.Name)?.Id;
                problem.Checker = null;
            }
        }

        private void TryAddExistingSubmissionTypes(Contest contest)
        {
            var submissionTypeNames = contest.ProblemGroups
                .SelectMany(pg => pg.Problems)
                .SelectMany(p => p.SubmissionTypes)
                .Select(st => st.Name)
                .Distinct()
                .ToList();

            var existingSubmissionTypes = this.dbContext.SubmissionTypes
                .Where(st => submissionTypeNames.Contains(st.Name))
                .ToList();

            foreach (var problem in contest.ProblemGroups.SelectMany(pg => pg.Problems))
            {
                problem.SubmissionTypes = problem.SubmissionTypes
                    .Where(st => existingSubmissionTypes.Any(est => est.Name == st.Name))
                    .ToList();

                problem.ProblemSubmissionTypeExecutionDetails = problem.ProblemSubmissionTypeExecutionDetails
                    .Where(ed => existingSubmissionTypes.Any(st => st.Name == ed.SubmissionType.Name))
                    .ToList();

                foreach (var submissionType in problem.SubmissionTypes)
                {
                    submissionType.Id = existingSubmissionTypes.First(st => st.Name == submissionType.Name).Id;
                }

                foreach (var executionDetail in problem.ProblemSubmissionTypeExecutionDetails)
                {
                    var submissionTypeId = existingSubmissionTypes.First(st => st.Name == executionDetail.SubmissionType.Name).Id;

                    executionDetail.Problem = problem;
                    executionDetail.ProblemId = default;
                    executionDetail.SubmissionTypeId = submissionTypeId;
                    executionDetail.SubmissionType = null;
                }
            }
        }
    }
}