using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using MissingFeatures;
using OJS.Data.Models;
using OJS.Services.Business.ParticipantScores.Models;
using OJS.Services.Data.Contests;
using OJS.Services.Data.Participants;

namespace OJS.Services.Business.ParticipantScores
{
    using System.Linq;

    using OJS.Common.Helpers;
    using OJS.Services.Data.ParticipantScores;
    using OJS.Services.Data.Submissions;

    public class ParticipantScoresBusinessService : IParticipantScoresBusinessService
    {
        private readonly IParticipantScoresDataService participantScoresData;
        private readonly ISubmissionsDataService submissionsData;
        private readonly IParticipantsDataService participantsData;
        private readonly IContestsDataService contestsDataService;

        public ParticipantScoresBusinessService(
            IParticipantScoresDataService participantScoresData,
            ISubmissionsDataService submissionsData,
            IParticipantsDataService participantsData, 
            IContestsDataService contestsDataService)
        {
            this.participantScoresData = participantScoresData;
            this.submissionsData = submissionsData;
            this.participantsData = participantsData;
            this.contestsDataService = contestsDataService;
        }

        public void RecalculateForParticipantByProblem(int participantId, int problemId)
        {
            var submission = this.submissionsData.GetBestForParticipantByProblem(participantId, problemId);

            if (submission != null)
            {
                this.participantScoresData.ResetBySubmission(submission);
            }
            else
            {
                this.participantScoresData.DeleteForParticipantByProblem(participantId, problemId);
            }
        }

        public void NormalizeAllPointsThatExceedAllowedLimit()
        {
            using (var scope = TransactionsHelper.CreateLongRunningTransactionScope())
            {
                this.NormalizeSubmissionPoints();
                this.NormalizeParticipantScorePoints();

                scope.Complete();
            }
        }

        public CategoryContestsParticipationSummary GetCategoryParticipationSummary(int categoryId, bool showHidden)
        {
            var contests = this.contestsDataService
                .GetAllNotDeletedByCategory(categoryId, showHidden)
                .OrderByDescending(c => c.CreatedOn)
                .ToList();

            var categoryResults = contests
                .Select(c => this.GetParticipationSummaryForContest(c))
                .ToList();
            
            var maxProblemsCount = categoryResults
                .Select(ps => ps.ProblemsCount)
                .Max();

            return new CategoryContestsParticipationSummary
            {
                MaxProblemsCount = maxProblemsCount,
                Results = categoryResults,
            };
        }
        public ParticipationsSummaryServiceModel GetParticipationSummaryForContest(Contest contest, bool official = true)
        {
            var participants = this.participantsData
                .GetAllByContestAndIsOfficial(contest.Id, official)
                .Include(p => p.User)
                .ToList();

            var results = new List<ParticipantScoresSummaryModel>();
            foreach (var participant in participants)
            {
                var userScores = this.participantScoresData
                    .GetAllByParticipantIdAndIsOfficial(participant.Id, official)
                    .Include(ps => ps.Submission)
                    .Include(ps => ps.Problem)
                    .ToList();

                var hasSubmissions = userScores.Count != 0 && userScores.All(us => us.Submission != null);
                if (!hasSubmissions)
                {
                    continue;
                }

                Dictionary<int, DateTime> problemOrderToFirstBestSubmissionTimeCreated = CalculateFirstBestSubmissionTimeForProblems(participant, userScores);

                var userStartTime = participant.ParticipationStartTime ?? participant.CreatedOn;

                SortedDictionary<int, double> problemOrderToTimeTakenBetweenBest =
                    CalculateTimeTakenBetweenBestForProblems(problemOrderToFirstBestSubmissionTimeCreated,
                        userStartTime);

                var lastSubmission = this.submissionsData.GetLastSubmittedForParticipant(participant.Id);
                
                results.Add(new ParticipantScoresSummaryModel
                {
                    ParticipantName = participant.User.UserName,
                    ProblemOrderToMinutesTakenToSolve = problemOrderToTimeTakenBetweenBest,
                    PointsTotal = userScores.Select(s => s.Points).Sum(),
                    TimeTotal = Math.Round((lastSubmission.CreatedOn - userStartTime).TotalMinutes),
                }); 
            }

            var problemsCount = contest.ProblemGroups
                .Where(pg => !pg.IsDeleted)
                .Count(pg => !pg.Problems.IsNullOrEmpty());
            
            return new ParticipationsSummaryServiceModel
            {
                ContestId = contest.Id,
                ContestName = contest.Name,
                Results = results,
                ProblemsCount = problemsCount
            };
        }

        private Dictionary<int, DateTime> CalculateFirstBestSubmissionTimeForProblems(Participant participant, IEnumerable<ParticipantScore> userScores)
        {
            Dictionary<int, DateTime> problemOrderToFirstBestSubmissionTimeCreated = new Dictionary<int, DateTime>();

            var participationProblemsForUser = userScores
                .Select(ps => ps.Problem)
                .OrderBy(p => p.OrderBy);

            int problemIndex = 0;
            foreach (var problem in participationProblemsForUser)
            {
                problemIndex++;
                var problemUserSubmissions =
                    this.submissionsData.GetAllByProblemAndParticipant(problem.Id, participant.Id)
                        .Where(s => s.Points == problem.MaximumPoints)
                        .OrderBy(s => s.CreatedOn);

                var firstBestSubmissionForProblem = problemUserSubmissions.FirstOrDefault();

                if (firstBestSubmissionForProblem == null)
                {
                    continue;
                }
                    
                problemOrderToFirstBestSubmissionTimeCreated[problemIndex] = firstBestSubmissionForProblem.CreatedOn;
            }

            return problemOrderToFirstBestSubmissionTimeCreated;
        }

        private SortedDictionary<int, double> CalculateTimeTakenBetweenBestForProblems(Dictionary<int, DateTime> problemOrderToFirstBestSubmissionTimeCreated, DateTime userStartTime)
        {
            var sortedDictionaryKeysList = problemOrderToFirstBestSubmissionTimeCreated
                .OrderBy(d => d.Value)
                .Select(x => x.Key)
                .ToList();
            
            int keyIndex = 1;
            SortedDictionary<int, double> problemOrderToTimeTakenBetweenBest = new SortedDictionary<int, double>();

            foreach (var key in sortedDictionaryKeysList)
            {
                var timeDifference = new TimeSpan?();

                var firstBestSubmissionTime = problemOrderToFirstBestSubmissionTimeCreated[key];
                if (keyIndex == 1)
                {
                    timeDifference = firstBestSubmissionTime - userStartTime;
                }
                else
                {
                    var indexOfPreviousProblem = sortedDictionaryKeysList.IndexOf(key) - 1;
                    var previousProblemOrder = sortedDictionaryKeysList[indexOfPreviousProblem];
                    var timeOfPreviousProblemBestSubmission =
                        problemOrderToFirstBestSubmissionTimeCreated[previousProblemOrder];
                    timeDifference = firstBestSubmissionTime - timeOfPreviousProblemBestSubmission;
                }
                    
                if (timeDifference.HasValue)
                {
                    problemOrderToTimeTakenBetweenBest[key] = Math.Round(timeDifference.Value.TotalMinutes);
                }
                    
                keyIndex++;
            }

            return problemOrderToTimeTakenBetweenBest;
        }

        private void NormalizeSubmissionPoints() =>
            this.submissionsData
                .GetAllHavingPointsExceedingLimit()
                .Select(s => new
                {
                    Submission = s,
                    ProblemMaxPoints = s.Problem.MaximumPoints,
                })
                .ToList()
                .ForEach(x =>
                {
                    x.Submission.Points = x.ProblemMaxPoints;

                    this.submissionsData.Update(x.Submission);
                });

        private void NormalizeParticipantScorePoints() =>
            this.participantScoresData
                .GetAllHavingPointsExceedingLimit()
                .Select(ps => new
                {
                    ParticipantScore = ps,
                    ProblemMaxPoints = ps.Problem.MaximumPoints
                })
                .ToList()
                .ForEach(x =>
                    this.participantScoresData.UpdateBySubmissionAndPoints(
                        x.ParticipantScore,
                        x.ParticipantScore.SubmissionId,
                        x.ProblemMaxPoints));
    }
}