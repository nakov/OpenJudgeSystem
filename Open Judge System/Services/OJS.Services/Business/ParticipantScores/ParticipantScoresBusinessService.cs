namespace OJS.Services.Business.ParticipantScores
{
    using System.Linq;
    using OJS.Common.Helpers;
    using OJS.Services.Data.ParticipantScores;
    using OJS.Services.Data.Submissions;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using MissingFeatures;
    using OJS.Common;
    using OJS.Common.Extensions;
    using OJS.Data.Models;
    using OJS.Services.Business.ParticipantScores.Models;
    using OJS.Services.Data.Contests;
    using OJS.Services.Data.Participants;


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
                .Where(c => c.Participants.Any(p => p.IsOfficial == official))
                .OrderByDescending(c => c.CreatedOn)
                .ToList();

            var participants =  this.participantsData.GetAllByContestIdsAndIsOfficial(contests.Select(c => c.Id), official)
                .Include(p => p.User)
                .Include(p => p.Submissions)
                .Include(p => p.Scores)
                .Include(p => p.Problems)
                .Where(p => p.Scores.Count != 0)
                .OrderBy(p => p.Contest.OrderBy)
                .ToList();
           
            var results = new List<ParticipantScoresSummaryModel>();
            participants
                .ChunkBy(GlobalConstants.BatchOperationsChunkSize)
                .ForEach(batch => results.AddRange(this.GetStatisticsForParticipants(batch)));

            var maxProblemsCount = results
                .Select(ps => ps.ProblemsCount)
                .Max();

            return new CategoryContestsParticipationSummary
            {
                MaxProblemsCount = maxProblemsCount,
                Results = results,
            };
        }

        private IEnumerable<ParticipantScoresSummaryModel> GetStatisticsForParticipants(
            IEnumerable<Participant> participants)
        {
            var participantsTimeAndSubmissionsInfo = participants
                .Where(p => p.Submissions.Any())
                .Select(p => new ParticipantSummaryInfoServiceModel
                {
                    Participant = p,
                    UserStartTime = p.ParticipationStartTime ?? p.CreatedOn,
                    ProblemGroups = p.Contest.ProblemGroups
                        .Where(group => !group.IsDeleted && group.Problems.Any(problem => !problem.IsDeleted))
                        .ToList(),
                    TimeInContest =
                        Math.Round((p.Submissions
                             .Select(s => s.CreatedOn)
                             .OrderByDescending(s => s)
                             .FirstOrDefault()
                         - (p.ParticipationStartTime ?? p.CreatedOn)).TotalMinutes),
                    MaximumPointsSubmissionsByProblems = p.Submissions
                        .Where(s => s.Points == s.Problem.MaximumPoints)
                        .GroupBy(s => s.ProblemId)
                        .Select(g
                            => new MaximumResultSubmissionByProblemServiceModel
                            {
                                ProblemId = g.Key.Value,
                                Submission = g.OrderBy(s => s.CreatedOn).FirstOrDefault()
                            })
                });

            return participantsTimeAndSubmissionsInfo
                .Where(i => i.MaximumPointsSubmissionsByProblems.Any())
                .Select(this.SummarizeParticipationWithMaximumPoints)
                .ToList();;
        }

        private ParticipantScoresSummaryModel SummarizeParticipationWithMaximumPoints(ParticipantSummaryInfoServiceModel participantInfo)
        {
            try
            {
                var topScoreSubmissionsOrderedByCreatedOn = participantInfo
                    .MaximumPointsSubmissionsByProblems
                    .OrderBy(s => s.Submission.CreatedOn);

                var problemOrderToTimeTakenBetweenBest = this.CalculateTimeTakenBetweenBestForProblems(
                    topScoreSubmissionsOrderedByCreatedOn,
                    participantInfo.UserStartTime);

                problemOrderToTimeTakenBetweenBest = NormalizeProblemGroupIndexes(
                    problemOrderToTimeTakenBetweenBest, 
                    participantInfo.ProblemGroups.Select(pg => pg.OrderBy), 
                    participantInfo.Participant.ContestId);

                return new ParticipantScoresSummaryModel
                {
                    ParticipantName = participantInfo.Participant.User.UserName,
                    ContestId = participantInfo.Participant.Contest.Id,
                    ContestName = participantInfo.Participant.Contest.Name,
                    ProblemsCount = participantInfo.ProblemGroups.Count,
                    ProblemOrderToMinutesTakenToSolve = problemOrderToTimeTakenBetweenBest,
                    PointsTotal = participantInfo.Participant.Scores.Select(s => s.Points).Sum(),
                    TimeTotal = participantInfo.TimeInContest,
                };
            }
            catch (Exception e)
            {
                Console.WriteLine();
                return null;
            }
        }
        
        private Dictionary<int, double> NormalizeProblemGroupIndexes(Dictionary<int, double> values, IEnumerable<int> problemGroupsOrderBy, int contestId)
        {
            var sortedOrderedBy = problemGroupsOrderBy.OrderBy(n => n).ToList();
            
            return sortedOrderedBy
                .Select(n => new
                {
                    Key = sortedOrderedBy.IndexOf(n) + 1,
                    Value = values.ContainsKey(n) 
                        ? values[n] 
                        : 0
                })
                .ToDictionary(k => k.Key, v => v.Value);
        }

        private Dictionary<int, double> CalculateTimeTakenBetweenBestForProblems(
            IEnumerable<MaximumResultSubmissionByProblemServiceModel> maxSubmissionsBySubmissionTime, 
            DateTime userStartTime)
        {
            Dictionary<int, double> taskCompletionTimeByProblemOrder = new Dictionary<int, double>();
            
            var earliestSubmission = maxSubmissionsBySubmissionTime.First();
            taskCompletionTimeByProblemOrder[earliestSubmission.Submission.Problem.ProblemGroup.OrderBy] =
                Math.Round((earliestSubmission.Submission.CreatedOn - userStartTime)
                .TotalMinutes);
            
            Enumerable
                .Range(0, maxSubmissionsBySubmissionTime.Count() - 1)
                .ForEach(index =>
                {
                    var earlierSubmission = maxSubmissionsBySubmissionTime.ElementAt(index);
                    var laterSubmission = maxSubmissionsBySubmissionTime.ElementAt(index + 1);

                    var taskCompletionDurationInMinutes = Math.Round(
                        (laterSubmission.Submission.CreatedOn - earlierSubmission.Submission.CreatedOn).TotalMinutes, 
                        0);
                    
                    taskCompletionTimeByProblemOrder[laterSubmission.Submission.Problem.ProblemGroup.OrderBy] = taskCompletionDurationInMinutes;
                });
            
            return taskCompletionTimeByProblemOrder;
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