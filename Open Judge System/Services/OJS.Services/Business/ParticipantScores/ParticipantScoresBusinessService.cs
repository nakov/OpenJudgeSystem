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

            var participants =
                this.participantsData.GetAllByContestIdsAndIsOfficial(contests.Select(c => c.Id), official)
                    .Include(p => p.User)
                    .Include(p => p.Submissions)
                    .Include(p => p.Scores)
                    .Include(p => p.Problems)
                    .ToList();

            var participantIds = participants.Select(p => p.Id);

            var maximumSubmissionsForParticipants = this.submissionsData
                .GetWithMaxPointsByParticipantIds(participantIds)
                .ToList()
                .GroupBy(sg => sg.First().Participant.ContestId)
                .ToList();

            var lastSubmissionsForParticipants = this.submissionsData
                .GetLastSubmittedForParticipants(participantIds)
                .ToList()
                .GroupBy(sg => sg.First().Participant.ContestId)
                .ToList();

            var participantsInfoByContest = participants
                .Where(p => p.Scores.Count != 0)
                .Select(p => new ParticipantSummaryInfoServiceModel
                {
                    Participant = p,
                    LastSubmittedForParticipant = this.GetLastSubmittedForParticipant(lastSubmissionsForParticipants, p),
                    MaximumPointsSubmissionsByProblems = this.GetListOfMaxSubmissionsForParticipant(maximumSubmissionsForParticipants, p),
                })
                .Where(p => p.LastSubmittedForParticipant != null)
                .GroupBy(pinfo => pinfo.Participant.ContestId)
                .ToList();
            
            var categoryResults = contests
                .Select(c => this.GetParticipationSummaryForContest(
                    c, 
                    participantsInfoByContest
                        .Where(g => g.Key == c.Id)
                        .FirstOrDefault()
                        .ToList(), 
                    official)
                )
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

        private Submission GetLastSubmittedForParticipant(
            IEnumerable<IGrouping<int, IGrouping<int, Submission>>> lastSubmittedByParticipants,
            Participant participant)
            => lastSubmittedByParticipants
                .Where(x => x.Key == participant.ContestId)
                .SelectMany(x => x.ToList())
                .Where(p => p.Key == participant.Id)
                .SelectMany(x => x.ToList())
                .FirstOrDefault();

        private IEnumerable<MaximumResultSubmissionByProblemServiceModel> GetListOfMaxSubmissionsForParticipant(
            IEnumerable<IGrouping<int, IGrouping<int, Submission>>> maximumSubmissionsByParticipants,
            Participant participant)
            => maximumSubmissionsByParticipants
                .Where(cg => cg.Key == participant.ContestId)
                .SelectMany(x => x.ToList())
                .Where(pg => pg.Key == participant.Id)
                .SelectMany(x => x.ToList())
                .Select(s => new MaximumResultSubmissionByProblemServiceModel
                {
                    ProblemId = s.ProblemId.Value,
                    Submission = s
                })
                .ToList();

        public ParticipationsSummaryServiceModel GetParticipationSummaryForContest(
            Contest contest, 
            IEnumerable<ParticipantSummaryInfoServiceModel> participants, 
            bool official)
        {
            var results = participants
                .Where(p => p.Participant.Scores.Count != 0 && p.Participant.Scores.All(ps => ps.Submission != null))
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

        private ParticipantScoresSummaryModel SummarizeParticipationWithMaximumPoints(ParticipantSummaryInfoServiceModel participantInfo)
        {
            Dictionary<int, DateTime> problemOrderToFirstBestSubmissionTimeCreated = this.CalculateFirstBestSubmissionTimeForProblems(participantInfo);

            var userStartTime = participantInfo.Participant.ParticipationStartTime ?? participantInfo.Participant.CreatedOn;

            SortedDictionary<int, double> problemOrderToTimeTakenBetweenBest =
                this.CalculateTimeTakenBetweenBestForProblems(problemOrderToFirstBestSubmissionTimeCreated,
                    userStartTime);

            return new ParticipantScoresSummaryModel
            {
                ParticipantName = participantInfo.Participant.User.UserName,
                ProblemOrderToMinutesTakenToSolve = problemOrderToTimeTakenBetweenBest,
                PointsTotal = participantInfo.Participant.Scores.Select(s => s.Points).Sum(),
                TimeTotal = Math.Round((participantInfo.LastSubmittedForParticipant.CreatedOn - userStartTime).TotalMinutes),
            };
        }

        private Dictionary<int, DateTime> CalculateFirstBestSubmissionTimeForProblems(ParticipantSummaryInfoServiceModel participantInfo)
        {
            Dictionary<int, DateTime> problemOrderToFirstBestSubmissionTimeCreated = new Dictionary<int, DateTime>();

            var participationProblemsForUser = participantInfo.Participant.Scores
                .Select(ps => ps.Problem)
                .OrderBy(p => p.OrderBy);

            int problemIndex = 0;
            participationProblemsForUser.ForEach(problem =>
            {
                problemIndex++;
                if (participantInfo.MaximumPointsSubmissionsByProblems == null)
                {
                    return;
                }
                 
                var problemUserSubmissions = participantInfo
                    .MaximumPointsSubmissionsByProblems
                    .Where(s => s.ProblemId == problem.Id)
                    .OrderBy(s => s.Submission.CreatedOn);

                if (!problemUserSubmissions.Any())
                {
                    return;
                }
                
                var firstBestSubmissionForProblem = problemUserSubmissions.FirstOrDefault();
                    
                problemOrderToFirstBestSubmissionTimeCreated[problemIndex] = firstBestSubmissionForProblem.Submission.CreatedOn;
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