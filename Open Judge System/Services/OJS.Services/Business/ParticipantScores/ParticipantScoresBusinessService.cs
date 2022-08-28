using System;
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

        public CategoryContestsParticipationSummary GetCategoryParticipationSummary(int categoryId, bool showHidden, bool official = true)
        {
            var contests = this.contestsDataService
                .GetAllNotDeletedByCategory(categoryId, showHidden)
                .Include(c => c.ProblemGroups)
                .Include(c => c.ProblemGroups.Select(pg => pg.Problems))
                .OrderByDescending(c => c.CreatedOn)
                .ToList();

            var categoryResults = contests
                .Select(c => this.GetParticipationSummaryForContest(c, official))
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
        public ParticipationsSummaryServiceModel GetParticipationSummaryForContest(Contest contest, bool official)
        {
            var participants = 
                        participantsData.GetAllByContestAndIsOfficial(contest.Id, official)
                            .Include(p => p.User)
                            .Include(p => p.Submissions)
                            .Include(p => p.Scores)
                            .Include(p => p.Problems)
                    .ToList();
            
            var results = participants
                .Where(p => p.Scores.Count != 0 && p.Scores.All(ps => ps.Submission != null))
                .Select(this.SummarizeParticipationWithMaximumPoints)
                .ToList();

            var problemsCount = contest.ProblemGroups.Count(pg => !pg.Problems.IsNullOrEmpty());
            
            return new ParticipationsSummaryServiceModel
            {
                ContestId = contest.Id,
                ContestName = contest.Name,
                Results = results,
                ProblemsCount = problemsCount
            };
        }

        private ParticipantScoresSummaryModel SummarizeParticipationWithMaximumPoints(Participant participant)
        {
            Dictionary<int, DateTime> problemOrderToFirstBestSubmissionTimeCreated = this.CalculateFirstBestSubmissionTimeForProblems(participant);

            var userStartTime = participant.ParticipationStartTime ?? participant.CreatedOn;

            SortedDictionary<int, double> problemOrderToTimeTakenBetweenBest =
                this.CalculateTimeTakenBetweenBestForProblems(problemOrderToFirstBestSubmissionTimeCreated,
                    userStartTime);

            var lastSubmission = this.submissionsData.GetLastSubmittedForParticipant(participant.Id);

            return new ParticipantScoresSummaryModel
            {
                ParticipantName = participant.User.,
                ProblemOrderToMinutesTakenToSolve = problemOrderToTimeTakenBetweenBest,
                PointsTotal = participant.Scores.Select(s => s.Points).Sum(),
                TimeTotal = Math.Round((lastSubmission.CreatedOn - userStartTime).TotalMinutes),
            };
        }

        private Dictionary<int, DateTime> CalculateFirstBestSubmissionTimeForProblems(Participant participant)
        {
            Dictionary<int, DateTime> problemOrderToFirstBestSubmissionTimeCreated = new Dictionary<int, DateTime>();

            var participationProblemsForUser = participant.Scores
                .Select(ps => ps.Problem)
                .OrderBy(p => p.OrderBy);

            int problemIndex = 0;
            participationProblemsForUser.ForEach(problem =>
            {
                problemIndex++;
                var problemUserSubmissions =
                    this.submissionsData.GetAllByProblemAndParticipant(problem.Id, participant.Id)
                        .Where(s => s.Points == problem.MaximumPoints)
                        .OrderBy(s => s.CreatedOn);

                var firstBestSubmissionForProblem = problemUserSubmissions.FirstOrDefault();

                if (firstBestSubmissionForProblem == null)
                {
                    return;
                }
                    
                problemOrderToFirstBestSubmissionTimeCreated[problemIndex] = firstBestSubmissionForProblem.CreatedOn;
            });

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

            sortedDictionaryKeysList.ForEach(key =>
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
            });

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