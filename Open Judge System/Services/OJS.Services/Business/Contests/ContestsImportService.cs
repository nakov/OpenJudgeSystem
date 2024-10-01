namespace OJS.Services.Business.Contests
{
    using System;
    using System.Collections.Generic;
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
            Contest existingContest = null;

            if (replace)
            {
                existingContest = this.dbContext.Contests
                    .Where(c => !c.IsDeleted)
                    .SingleOrDefault(c => c.CategoryId == categoryIdToImportTo && c.Name == contest.Name);
            }

            var problems = contest.ProblemGroups.SelectMany(pg => pg.Problems).ToList();

            this.TryAddExistingCheckers(problems);
            this.TryAddExistingSubmissionTypes(problems);

            contest.CategoryId = categoryIdToImportTo;
            contest.ImportedOn = DateTime.Now;

            if (replace && existingContest != null)
            {
                // TODO: Implement replacing
            }
            else
            {
                contest.Id = default(int);
                contest.ProblemGroups = GetNewProblemGroups(contest.ProblemGroups);

                this.dbContext.Contests.Add(contest);
                this.dbContext.SaveChanges();
            }

            return new ContestImportResult
            {
                IsSuccess = true,
                NewContestId = contest.Id,
                NewCategoryId = categoryIdToImportTo,
                ContestImportedFromId = contestImportedFromId,
                CategoryImportedFromId = categoryImportedFromId,
            };
        }

        private static List<ProblemGroup> GetNewProblemGroups(IEnumerable<ProblemGroup> problemGroups)
            => problemGroups
                .Where(pg => !pg.IsDeleted)
                .Select(problemGroup => new ProblemGroup
                {
                    Type = problemGroup.Type,
                    OrderBy = problemGroup.OrderBy,
                    Problems = GetNewProblems(problemGroup.Problems),
                })
                .ToList();


        private static List<Problem> GetNewProblems(IEnumerable<Problem> problems)
            => problems
                .Where(p => !p.IsDeleted)
                .Select(problem => new Problem
                {
                    Name = problem.Name,
                    OrderBy = problem.OrderBy,
                    CheckerId = problem.CheckerId,
                    TimeLimit = problem.TimeLimit,
                    MemoryLimit = problem.MemoryLimit,
                    SourceCodeSizeLimit = problem.SourceCodeSizeLimit,
                    AdditionalFiles = problem.AdditionalFiles,
                    SolutionSkeleton = problem.SolutionSkeleton,
                    MaximumPoints = problem.MaximumPoints,
                    ShowResults = problem.ShowResults,
                    ShowDetailedFeedback = problem.ShowDetailedFeedback,
                    DefaultSubmissionTypeId = problem.DefaultSubmissionTypeId,
                    SubmissionTypes = problem.SubmissionTypes,
                    ProblemSubmissionTypeExecutionDetails = problem.ProblemSubmissionTypeExecutionDetails,
                    Resources = GetNewResources(problem.Resources),
                    Tests = GetNewTests(problem.Tests),
                })
                .ToList();

        private static List<ProblemResource> GetNewResources(IEnumerable<ProblemResource> resources)
            => resources
                .Where(r => !r.IsDeleted)
                .Select(resource => new ProblemResource
                {
                    Name = resource.Name,
                    OrderBy = resource.OrderBy,
                    Link = resource.Link,
                    FileExtension = resource.FileExtension,
                    Type = resource.Type,
                    File = resource.File,
                })
                .ToList();

        private static List<Test> GetNewTests(IEnumerable<Test> tests)
            => tests
                .Select(test => new Test
                {
                    OrderBy = test.OrderBy,
                    InputData = test.InputData,
                    OutputData = test.OutputData,
                    HideInput = test.HideInput,
                    IsTrialTest = test.IsTrialTest,
                    IsOpenTest = test.IsOpenTest,
                })
                .ToList();

        private void TryAddExistingCheckers(List<Problem> problems)
        {
            var checkerNames = problems
                .Select(p => p.Checker)
                .Select(c => c.Name)
                .Distinct()
                .ToList();

            var existingCheckers = this.dbContext.Checkers
                .Where(c => !c.IsDeleted)
                .Where(c => checkerNames.Contains(c.Name))
                .ToList();

            foreach (var problem in problems)
            {
                var checker = existingCheckers.FirstOrDefault(c => c.Name == problem.Checker?.Name);
                problem.CheckerId = checker?.Id;
                problem.Checker = null;
            }
        }

        private void TryAddExistingSubmissionTypes(List<Problem> problems)
        {
            var submissionTypeNames = problems
                .SelectMany(p => p.SubmissionTypes)
                .Select(st => st.Name)
                .Distinct()
                .ToList();

            var existingSubmissionTypes = this.dbContext.SubmissionTypes
                .Where(st => submissionTypeNames.Contains(st.Name))
                .ToList();

            foreach (var problem in problems)
            {
                problem.SubmissionTypes = problem.SubmissionTypes
                    .Where(st => existingSubmissionTypes.Any(est => est.Name == st.Name))
                    .ToList();

                problem.ProblemSubmissionTypeExecutionDetails = problem.ProblemSubmissionTypeExecutionDetails
                    .Where(ed => existingSubmissionTypes.Any(st => st.Name == ed.SubmissionType.Name))
                    .ToList();

                problem.DefaultSubmissionTypeId = existingSubmissionTypes.FirstOrDefault(st => st.Name == problem.DefaultSubmissionType?.Name)?.Id;

                var problemSubmissionTypeNames = problem.SubmissionTypes.Select(st => st.Name).ToList();

                problem.SubmissionTypes.Clear();

                foreach (var problemSubmissionTypeName in problemSubmissionTypeNames)
                {
                    problem.SubmissionTypes.Add(existingSubmissionTypes.First(st => st.Name == problemSubmissionTypeName));
                }

                foreach (var executionDetail in problem.ProblemSubmissionTypeExecutionDetails)
                {
                    var submissionTypeId = existingSubmissionTypes.First(st => st.Name == executionDetail.SubmissionType.Name).Id;

                    executionDetail.ProblemId = problem.Id;
                    executionDetail.Problem = null;
                    executionDetail.SubmissionTypeId = submissionTypeId;
                    executionDetail.SubmissionType = null;
                }
            }
        }
    }
}