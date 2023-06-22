namespace OJS.Web.Areas.Api.Controllers
{
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity;
    using System.Linq;
    using System.Reflection;
    using System.Web.Mvc;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;
    using OJS.Data;
    using OJS.Web.Common.Extensions;
    using OJS.Web.Infrastructure.Filters.Attributes;

    [ValidateRemoteDataApiKey]
    public class ContestCategoriesController : ApiController
    {
        private readonly OjsDbContext dbContext;

        public ContestCategoriesController(OjsDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public ActionResult ExportData(int id)
        {
            this.dbContext.Configuration.LazyLoadingEnabled = false;
            var contestCategory = this.dbContext.ContestCategories
                .AsNoTracking()
                .Include(x => x.Children)
                .Include(x => x.Children.Select(category => category.Children))
                .Include(x => x.Children.Select(category => category.Children.Select(recursiveCategory => recursiveCategory.Contests)))
                .Include(x => x.Children.Select(category => category.Children.Select(recursiveCategory => recursiveCategory.Contests.Select(contest => contest.ProblemGroups))))
                .Include(x => x.Children.Select(
                    category => category.Children.Select(
                        recursiveCategory => recursiveCategory.Contests.Select(
                            contest => contest.ProblemGroups.Select(
                                group => group.Contest)))))
                .Include(x => x.Children.Select(
                    category => category.Children.Select(
                        recursiveCategory => recursiveCategory.Contests.Select(
                            contest => contest.ProblemGroups.Select(
                                group => group.Problems)))))
                .Include(x => x.Children.Select(
                    category => category.Children.Select(
                        recursiveCategory => recursiveCategory.Contests.Select(
                            contest => contest.ProblemGroups.Select(
                                group => group.Problems.Select(problem => problem.Checker))))))
                .Include(x => x.Children.Select(
                    category => category.Children.Select(
                        recursiveCategory => recursiveCategory.Contests.Select(
                            contest => contest.ProblemGroups.Select(
                                group => group.Problems.Select(problem => problem.Tests))))))
                .Include(x => x.Children.Select(
                    category => category.Children.Select(
                        recursiveCategory => recursiveCategory.Contests.Select(
                            contest => contest.ProblemGroups.Select(
                                group => group.Problems.Select(problem => problem.SubmissionTypes))))))
                .Include(x => x.Children.Select(
                    category => category.Children.Select(
                        recursiveCategory => recursiveCategory.Contests.Select(
                            contest => contest.ProblemGroups.Select(
                                group => group.Problems.Select(problem => problem.ProblemSubmissionTypesSkeletons))))))
                .Select(x =>
                    new
                    {
                        x.Id,
                        x.Name,
                        x.IsVisible,
                        x.OrderBy,
                        Children = x.Children.Select(child => new
                        {
                            child.Name,
                            x.IsVisible,
                            x.OrderBy,
                            Children = child.Children.Select(recursiveChild => new
                            {
                                recursiveChild.Name,
                                recursiveChild.IsVisible,
                                recursiveChild.OrderBy,
                                Contests = recursiveChild.Contests.Select(contest => new
                                {
                                    contest.Name,
                                    contest.IsVisible,
                                    contest.VisibleFrom,
                                    contest.AutoChangeTestsFeedbackVisibility,
                                    contest.Type,
                                    contest.Duration,
                                    contest.StartTime,
                                    contest.EndTime,
                                    contest.ContestPassword,
                                    contest.PracticePassword,
                                    contest.NewIpPassword,
                                    contest.PracticeStartTime,
                                    contest.PracticeEndTime,
                                    contest.LimitBetweenSubmissions,
                                    contest.OrderBy,
                                    contest.NumberOfProblemGroups,
                                    contest.Description,
                                    contest.UsersCantSubmitConcurrently,
                                    contest.EnsureValidAuthorSubmisions,
                                    contest.AllowedIps,
                                    ProblemGroups = contest.ProblemGroups.Select(group => new
                                    {
                                        group.Id,
                                        group.OrderBy,
                                        group.Type,
                                        Problems = group.Problems.Select(problem => new
                                        {
                                            problem.Id,
                                            problem.Name,
                                            problem.MaximumPoints,
                                            problem.TimeLimit,
                                            problem.MemoryLimit,
                                            problem.SourceCodeSizeLimit,
                                            problem.OrderBy,
                                            problem.SolutionSkeleton,
                                            problem.AdditionalFiles,
                                            problem.ShowResults,
                                            problem.ShowDetailedFeedback,
                                            Checker = new
                                            {
                                                problem.Checker.Id,
                                                problem.Checker.Name,
                                            },
                                            Tests = problem.Tests.Select(test => new
                                            {
                                                test.Id,
                                                test.IsTrialTest,
                                                test.IsOpenTest,
                                                test.HideInput,
                                                test.OrderBy,
                                                test.InputData,
                                                test.OutputData
                                            }),
                                            SubmissionTypes = problem.SubmissionTypes.Select(submissionType => new
                                            {
                                                submissionType.Id,
                                                submissionType.Name,
                                            }),
                                            ProblemSubmissionTypesSkeletons =
                                                problem.ProblemSubmissionTypesSkeletons.Select(
                                                    skeleton => new
                                                    {
                                                        skeleton.SolutionSkeleton,
                                                        SubmissionType = new
                                                        {
                                                            skeleton.SubmissionType.Name,
                                                            skeleton.SubmissionType.Id
                                                        },
                                                    }),
                                            Resources = problem.Resources.Select(resource => new
                                            {
                                                resource.Id,
                                                resource.Name,
                                                resource.Type,
                                                resource.File,
                                                resource.FileExtension,
                                                resource.Link,
                                                resource.OrderBy
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                .FirstOrDefault(x => x.Id == id);

            if (contestCategory == null)
            {
                return this.JsonError($"Contest Category with id: {id} is not found!");
            }

            return this.Content(
                JsonConvert.SerializeObject(contestCategory, new JsonSerializerSettings()
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            }), "application/json");
        }
    }
}