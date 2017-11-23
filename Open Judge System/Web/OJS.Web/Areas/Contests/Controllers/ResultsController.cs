﻿namespace OJS.Web.Areas.Contests.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Web;
    using System.Web.Caching;
    using System.Web.Mvc;

    using Kendo.Mvc.Extensions;
    using Kendo.Mvc.UI;

    using X.PagedList;

    using OJS.Data;
    using OJS.Services.Data.Contests;
    using OJS.Services.Data.Participants;
    using OJS.Web.Areas.Contests.ViewModels.Contests;
    using OJS.Web.Areas.Contests.ViewModels.Results;
    using OJS.Web.Common.Attributes;
    using OJS.Web.Common.Extensions;
    using OJS.Web.Controllers;
    
    using Resource = Resources.Areas.Contests.ContestsGeneral;

    public class ResultsController : BaseController
    {
        public const int OfficialResultsPageSize = 100;
        public const int NotOfficialResultsPageSize = 50;

        private readonly IContestsDataService contestsData;
        private readonly IParticipantsDataService participantsData;

        public ResultsController(
            IOjsData data,
            IContestsDataService contestsData,
            IParticipantsDataService participantsData)
            : base(data)
        {
            this.contestsData = contestsData;
            this.participantsData = participantsData;
        }

        /// <summary>
        /// Gets the results for a particular problem for users with at least one submission.
        /// </summary>
        /// <param name="request">The datasource request.</param>
        /// <param name="id">The id of the problem.</param>
        /// <param name="official">A flag checking if the requested results are for practice or for a competition.</param>
        /// <returns>Returns the best result for each user who has at least one submission for the problem.</returns>
        [Authorize]
        public ActionResult ByProblem([DataSourceRequest] DataSourceRequest request, int id, bool official)
        {
            var problem = this.Data.Problems.GetById(id);

            if (!this.participantsData
                    .AnyByContestIdUserIdAndIsOfficial(problem.ContestId, this.UserProfile.Id, official))
            {
                throw new HttpException((int)HttpStatusCode.Unauthorized, Resource.User_is_not_registered_for_exam);
            }

            if (!problem.ShowResults)
            {
                throw new HttpException((int)HttpStatusCode.Forbidden, Resource.Problem_results_not_available);
            }

            var results = this.Data.ParticipantScores
                .All()
                .Where(ps => ps.ProblemId == problem.Id && ps.IsOfficial == official)
                .Select(ps => new ProblemResultViewModel
                {
                    SubmissionId = ps.SubmissionId,
                    ParticipantName = ps.ParticipantName,
                    MaximumPoints = problem.MaximumPoints,
                    Result = ps.Points
                })
                .ToList();

            return this.Json(results.ToDataSourceResult(request), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the results for a contest.
        /// </summary>
        /// <param name="id">The contest id.</param>
        /// <param name="official">A flag, showing if the results are for practice
        /// or for competition</param>
        /// <returns>Returns a view with the results of the contest.</returns>
        [Authorize]
        public ActionResult Simple(int id, bool official, int? page)
        {
            var contest = this.contestsData.GetById(id);

            if (contest == null)
            {
                throw new HttpException((int)HttpStatusCode.NotFound, Resource.Contest_not_found);
            }

            // If the results are not visible and the participant is not registered for the contest
            // then he is not authorized to view the results
            if (!contest.ResultsArePubliclyVisible &&
                official &&
                !this.participantsData.AnyByContestIdUserIdAndIsOfficial(id, this.UserProfile.Id, official) &&
                !this.User.IsAdmin())
            {
                throw new HttpException((int)HttpStatusCode.Forbidden, Resource.Contest_results_not_available);
            }

            var isUserLecturerInContest =
                this.Data.Users.All().Any(x => x.Id == this.UserProfile.Id && x.LecturerInContests.Any(y => y.ContestId == id));

            var isUserAdminOrLecturerInContest = isUserLecturerInContest || this.User.IsAdmin();

            page = page ?? 1;

            var totalParticipantsCount = this.GetTotalParticipantsCount(contest.Id, official);

            var resultsInPage = NotOfficialResultsPageSize;
            if (official)
            {
                resultsInPage = OfficialResultsPageSize;
            }

            var contestResults = this.GetContestResults(
                contest.Id,
                totalParticipantsCount,
                official,
                isUserAdminOrLecturerInContest,
                isFullResults: false,
                page: page.Value,
                resultsInPage: resultsInPage);

            if (contestResults == null)
            {
                throw new HttpException((int)HttpStatusCode.NotFound, Resource.Contest_not_found);
            }

            contestResults.ContestCanBeCompeted = contest.CanBeCompeted;
            contestResults.ContestCanBePracticed = contest.CanBePracticed;

            return this.View(contestResults);
        }

        [AjaxOnly]
        public ActionResult SimplePartial(
            int contestId,
            bool official,
            bool isUserAdminOrLecturerInContest,
            bool contestCanBeCompeted,
            bool contestCanBePracticed,
            int page,
            int resultsInPage)
        {
            var cacheKey = $"{this.Request.Url.AbsolutePath}?{nameof(page)}={page}";
            var totalParticipantsCacheKey = this.Request.Url.AbsolutePath;

            ContestResultsViewModel contestResults = null;
            var totalParticipantsCount = 0;
            if (!official && !isUserAdminOrLecturerInContest)
            {
                contestResults = this.HttpContext.Cache[cacheKey] as ContestResultsViewModel;
                totalParticipantsCount = this.HttpContext.Cache[totalParticipantsCacheKey] != null ?
                    (int)this.HttpContext.Cache[totalParticipantsCacheKey] :
                    0;
            }

            if (totalParticipantsCount == 0)
            {
                totalParticipantsCount = this.GetTotalParticipantsCount(contestId, official);

                if (!official && !isUserAdminOrLecturerInContest)
                {
                    this.HttpContext.Cache.Add(
                        key: totalParticipantsCacheKey,
                        value: totalParticipantsCount,
                        dependencies: null,
                        absoluteExpiration: DateTime.Now.AddMinutes(2),
                        slidingExpiration: Cache.NoSlidingExpiration,
                        priority: CacheItemPriority.Normal,
                        onRemoveCallback: null);
                }
            }

            if (contestResults == null)
            {
                contestResults = this.GetContestResults(
                    contestId,
                    totalParticipantsCount,
                    official,
                    isUserAdminOrLecturerInContest,
                    isFullResults: false,
                    page: page,
                    resultsInPage: resultsInPage);

                if (contestResults == null)
                {
                    throw new HttpException((int)HttpStatusCode.NotFound, Resource.Contest_not_found);
                }

                contestResults.ContestCanBeCompeted = contestCanBeCompeted;
                contestResults.ContestCanBePracticed = contestCanBePracticed;

                if (!official && !isUserAdminOrLecturerInContest)
                {
                    this.HttpContext.Cache.Add(
                        key: cacheKey,
                        value: contestResults,
                        dependencies: null,
                        absoluteExpiration: DateTime.Now.AddMinutes(2),
                        slidingExpiration: Cache.NoSlidingExpiration,
                        priority: CacheItemPriority.Normal,
                        onRemoveCallback: null);
                }
            }

            return this.PartialView("_SimplePartial", contestResults);
        }

        // TODO: Unit test
        [Authorize]
        public ActionResult Full(int id, bool official, int? page)
        {
            if (!this.contestsData.UserHasAccessByIdUserIdAndIsAdmin(id, this.UserProfile.Id, this.User.IsAdmin()))
            {
                throw new HttpException((int)HttpStatusCode.Forbidden, Resource.Contest_results_not_available);
            }

            page = page ?? 1;

            var totalParticipantsCount = this.GetTotalParticipantsCount(id, official);
            var contestResults = this.GetContestResults(
                id,
                totalParticipantsCount,
                official,
                isUserAdminOrLecturer: true,
                isFullResults: true,
                page: page.Value,
                resultsInPage: NotOfficialResultsPageSize);

            if (contestResults == null)
            {
                throw new HttpException((int)HttpStatusCode.NotFound, Resource.Contest_not_found);
            }

            return this.View(contestResults);
        }

        [AjaxOnly]
        public ActionResult FullPartial(
            int contestId,
            bool official,
            int page,
            int resultsInPage)
        {
            var contestResults = this.GetContestResults(
                contestId,
                this.GetTotalParticipantsCount(contestId, official),
                official,
                isUserAdminOrLecturer: true,
                isFullResults: true,
                page: page,
                resultsInPage: resultsInPage);

            if (contestResults == null)
            {
                throw new HttpException((int)HttpStatusCode.NotFound, Resource.Contest_not_found);
            }

            return this.PartialView("_FullPartial", contestResults);
        }   

        [Authorize]
        public ActionResult Export(int id, bool official)
        {
            if (!this.contestsData.UserHasAccessByIdUserIdAndIsAdmin(id, this.UserProfile.Id, this.User.IsAdmin()))
            {
                throw new HttpException((int)HttpStatusCode.Forbidden, Resource.Contest_results_not_available);
            }

            var contest = this.contestsData.GetById(id);

            if (contest == null)
            {
                throw new HttpException((int)HttpStatusCode.NotFound, Resource.Contest_not_found);
            }

            var totalParticipantsCount = this.GetTotalParticipantsCount(contest.Id, official);
            var contestResults = this.GetContestResults(contest.Id, totalParticipantsCount, official, true, true);

            return this.View(contestResults);
        }

        [Authorize]
        public ActionResult GetParticipantsAveragePoints(int id)
        {
            if (!this.contestsData.UserHasAccessByIdUserIdAndIsAdmin(id, this.UserProfile.Id, this.User.IsAdmin()))
            {
                throw new HttpException((int)HttpStatusCode.Forbidden, Resource.Contest_results_not_available);
            }

            var contestInfo = this.contestsData
                    .GetByIdQuery(id)
                    .Select(c => new
                    {
                        c.Id,
                        ParticipantsCount = (double)c.Participants
                            .Where(p => p.Scores.Any())
                            .Count(p => p.IsOfficial),
                        c.StartTime,
                        c.EndTime
                    })
                    .FirstOrDefault();

            var submissions = this.participantsData
                .GetAllQuery()
                .Where(participant => participant.ContestId == contestInfo.Id && participant.IsOfficial)
                .SelectMany(participant =>
                    participant.Contest.Problems
                        .Where(pr => !pr.IsDeleted)
                        .SelectMany(pr => pr.Submissions
                            .Where(subm => !subm.IsDeleted && subm.ParticipantId == participant.Id)
                            .Select(subm => new
                            {
                                subm.Points,
                                subm.CreatedOn,
                                ParticipantId = participant.Id,
                                ProblemId = pr.Id
                            })))
                .OrderBy(subm => subm.CreatedOn)
                .ToList();

            var viewModel = new List<ContestStatsChartViewModel>();

            for (var time = contestInfo.StartTime.Value.AddMinutes(5); time <= contestInfo.EndTime.Value && time < DateTime.Now; time = time.AddMinutes(5))
            {
                if (!submissions.Any(pr => pr.CreatedOn >= contestInfo.StartTime && pr.CreatedOn <= time))
                {
                    continue;
                }

                var averagePointsLocal = submissions
                    .Where(pr => pr.CreatedOn >= contestInfo.StartTime && pr.CreatedOn <= time)
                    .GroupBy(pr => new { pr.ProblemId, pr.ParticipantId })
                    .Select(gr => new
                    {
                        MaxPoints = gr.Max(pr => pr.Points),
                        gr.Key.ParticipantId
                    })
                    .GroupBy(pr => pr.ParticipantId)
                    .Select(gr => gr.Sum(pr => pr.MaxPoints))
                    .Aggregate((sum, el) => sum + el) / contestInfo.ParticipantsCount;

                viewModel.Add(new ContestStatsChartViewModel
                {
                    AverageResult = averagePointsLocal,
                    Minute = time.Minute,
                    Hour = time.Hour
                });
            }

            return this.Json(viewModel);
        }

        [Authorize]
        public ActionResult Stats(int contestId, bool official)
        {
            if (!this.contestsData.UserHasAccessByIdUserIdAndIsAdmin(contestId, this.UserProfile.Id, this.User.IsAdmin()))
            {
                throw new HttpException((int)HttpStatusCode.Forbidden, Resource.Contest_results_not_available);
            }

            var totalParticipantsCount = this.GetTotalParticipantsCount(contestId, official);
            var contestResults = this.GetContestResults(contestId, totalParticipantsCount, official, true, true);

            if (contestResults == null)
            {
                throw new HttpException((int)HttpStatusCode.NotFound, Resource.Contest_not_found);
            }

            var maxResult = contestResults.Problems.Sum(p => p.MaximumPoints);

            var participantsCount = contestResults.Results.TotalItemCount;
            var statsModel = new ContestStatsViewModel
            {
                MinResultsCount = contestResults.Results.Count(r => r.Total == 0),
                MaxResultsCount = contestResults.Results.Count(r => r.Total == maxResult),
                AverageResult = (double)contestResults.Results.Sum(r => r.Total) / participantsCount
            };

            statsModel.MinResultsPercent = (double)statsModel.MinResultsCount / participantsCount;
            statsModel.MaxResultsPercent = (double)statsModel.MaxResultsCount / participantsCount;

            var fromPoints = 0;
            var toPoints = 0;
            foreach (var problem in contestResults.Problems)
            {
                var maxResultsForProblem = contestResults.Results
                    .Count(r => r.ProblemResults?
                        .Any(pr =>
                            pr.Id == problem.Id &&
                            pr.BestSubmission != null && pr.BestSubmission.Points == problem.MaximumPoints) ?? false);

                var maxResultsForProblemPercent = (double)maxResultsForProblem / participantsCount;
                statsModel.StatsByProblem.Add(new ContestProblemStatsViewModel
                {
                    Name = problem.Name,
                    MaxResultsCount = maxResultsForProblem,
                    MaxResultsPercent = maxResultsForProblemPercent,
                    MaxPossiblePoints = problem.MaximumPoints
                });

                if (toPoints == 0)
                {
                    toPoints = problem.MaximumPoints;
                }
                else
                {
                    toPoints += problem.MaximumPoints;
                }

                var participantsInPointsRange = contestResults.Results.Count(r => r.Total >= fromPoints && r.Total <= toPoints);
                var participantsInPointsRangePercent = (double)participantsInPointsRange / participantsCount;

                statsModel.StatsByPointsRange.Add(new ContestPointsRangeViewModel
                {
                    PointsFrom = fromPoints,
                    PointsTo = toPoints,
                    Participants = participantsInPointsRange,
                    PercentOfAllParticipants = participantsInPointsRangePercent
                });

                fromPoints = toPoints + 1;
            }

            return this.PartialView("_StatsPartial", statsModel);
        }

        [Authorize]
        public ActionResult StatsChart(int contestId)
        {
            if (!this.contestsData.UserHasAccessByIdUserIdAndIsAdmin(contestId, this.UserProfile.Id, this.User.IsAdmin()))
            {
                throw new HttpException((int)HttpStatusCode.Forbidden, Resource.Contest_results_not_available);
            }

            return this.PartialView("_StatsChartPartial", contestId);
        }

        private ContestResultsViewModel GetContestResults(
            int contestId,
            int totalParticipantsCount,
            bool official,
            bool isUserAdminOrLecturer,
            bool isFullResults,
            int page = 1,
            int resultsInPage = int.MaxValue)
        {
            var resultsToSkip = (page - 1) * resultsInPage;
            ContestResultsViewModel contestResults;
            if (isFullResults)
            {
                contestResults = this.contestsData
                    .GetByIdQuery(contestId)
                    .Select(c => new ContestResultsViewModel
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Problems = c.Problems
                            .AsQueryable()
                            .OrderBy(pr => pr.OrderBy)
                            .ThenBy(pr => pr.Name)
                            .Where(pr => !pr.IsDeleted)
                            .Select(ContestProblemListViewModel.FromProblem),
                        ResultsSubset = c.Participants
                            .Where(p => p.Scores.Any() && p.IsOfficial == official)
                            .Select(par => new ParticipantResultViewModel
                            {
                                ParticipantUsername = par.User.UserName,
                                ParticipantFirstName = par.User.UserSettings.FirstName,
                                ParticipantLastName = par.User.UserSettings.LastName,
                                ProblemResults = c.Problems
                                    .Where(pr => !pr.IsDeleted)
                                    .OrderBy(pr => pr.OrderBy)
                                    .ThenBy(pr => pr.Name)
                                    .Select(pr => new ProblemResultPairViewModel
                                    {
                                        Id = pr.Id,
                                        ShowResult = pr.ShowResults,
                                        MaximumPoints = pr.MaximumPoints,
                                        BestSubmission = pr.ParticipantScores
                                            .Where(parScore =>
                                                parScore.ParticipantId == par.Id &&
                                                parScore.IsOfficial == official)
                                            .Select(parScore => new BestSubmissionViewModel
                                            {
                                                Id = parScore.SubmissionId,
                                                Points = parScore.Points,
                                                IsCompiledSuccessfully = parScore.Submission.IsCompiledSuccessfully,
                                                SubmissionType = parScore.Submission.SubmissionType.Name,
                                                TestRunsCache = parScore.Submission.TestRunsCache
                                            })
                                            .FirstOrDefault()
                                    })
                            })
                            .OrderByDescending(parRes => parRes.ProblemResults
                                .Sum(prRes => prRes.BestSubmission != null ? prRes.BestSubmission.Points : 0))
                            .ThenByDescending(parResult => parResult.ProblemResults
                                .OrderBy(prRes => prRes.BestSubmission != null ? prRes.BestSubmission.Id : 0)
                                .Select(prRes => prRes.BestSubmission != null ? prRes.BestSubmission.Id : 0)
                                .FirstOrDefault())
                            .Skip(resultsToSkip)
                            .Take(resultsInPage)
                    })
                    .FirstOrDefault();
            }
            else
            {
                contestResults = this.contestsData
                    .GetByIdQuery(contestId)
                    .Select(c => new ContestResultsViewModel
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Problems = c.Problems
                            .AsQueryable()
                            .OrderBy(pr => pr.OrderBy)
                            .ThenBy(pr => pr.Name)
                            .Where(pr => !pr.IsDeleted)
                            .Select(ContestProblemListViewModel.FromProblem),
                        ResultsSubset = c.Participants
                            .Where(p => p.Scores.Any() && p.IsOfficial == official)
                            .Select(par => new ParticipantResultViewModel
                            {
                                ParticipantUsername = par.User.UserName,
                                ParticipantFirstName = par.User.UserSettings.FirstName,
                                ParticipantLastName = par.User.UserSettings.LastName,
                                ProblemResults = c.Problems
                                    .Where(pr => !pr.IsDeleted)
                                    .OrderBy(pr => pr.OrderBy)
                                    .ThenBy(pr => pr.Name)
                                    .Select(pr => new ProblemResultPairViewModel
                                    {
                                        Id = pr.Id,
                                        ShowResult = pr.ShowResults,
                                        BestSubmission = pr.ParticipantScores
                                            .Where(parScore =>
                                                parScore.ParticipantId == par.Id &&
                                                parScore.IsOfficial == official)
                                            .Select(parScore => new BestSubmissionViewModel
                                            {
                                                Id = parScore.SubmissionId,
                                                Points = parScore.Points
                                            })
                                            .FirstOrDefault()
                                    })
                            })
                            .OrderByDescending(parRes => isUserAdminOrLecturer ? parRes.ProblemResults
                                    .Sum(prRes => prRes.BestSubmission != null ? prRes.BestSubmission.Points : 0) :
                                parRes.ProblemResults
                                    .Where(problRes => problRes.ShowResult)
                                    .Sum(prRes => prRes.BestSubmission != null ? prRes.BestSubmission.Points : 0))
                            .ThenByDescending(parResult => parResult.ProblemResults
                                .OrderBy(prRes => prRes.BestSubmission != null ? prRes.BestSubmission.Id : 0)
                                .Select(prRes => prRes.BestSubmission != null ? prRes.BestSubmission.Id : 0)
                                .FirstOrDefault())
                            .Skip(resultsToSkip)
                            .Take(resultsInPage)
                    })
                    .FirstOrDefault();
            }

            if (contestResults != null)
            {
                contestResults.IsOfficialResults = official;
                contestResults.UserIsLecturerInContest = isUserAdminOrLecturer;
                contestResults.Results = new StaticPagedList<ParticipantResultViewModel>(
                    contestResults.ResultsSubset,
                    page,
                    resultsInPage,
                    totalParticipantsCount);
            }

            return contestResults;
        }

        private int GetTotalParticipantsCount(int contestId, bool isOfficial) =>
            this.contestsData
                .GetByIdQuery(contestId)
                .Select(c => c.Participants.Count(p => p.Scores.Any() && p.IsOfficial == isOfficial))
                .FirstOrDefault();
    }
}