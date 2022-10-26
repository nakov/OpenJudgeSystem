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
    using System.Text.RegularExpressions;

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
                    TimeInContest = CalculateTimeInMinutesFromParticipationStartToLastSubmission(p),
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
            var topScoreSubmissionsOrderedByCreatedOn = participantInfo
                .MaximumPointsSubmissionsByProblems
                .OrderBy(s => s.Submission.CreatedOn);

            var problemOrderToTimeTakenBetweenBest = this.CalculateTimeTakenBetweenBestForProblems(
                topScoreSubmissionsOrderedByCreatedOn,
                participantInfo.UserStartTime);

            problemOrderToTimeTakenBetweenBest = NormalizeProblemGroupIndexesAndEmptyValues(
                problemOrderToTimeTakenBetweenBest, 
                participantInfo.ProblemGroups.Select(pg => pg.OrderBy));

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

        private Dictionary<int, ParticipantSummarySubmissionInfoServiceModel> CalculateTimeTakenBetweenBestForProblems(
            IEnumerable<MaximumResultSubmissionByProblemServiceModel> maxSubmissionsBySubmissionTime, 
            DateTime userStartTime)
        {
            var maxSubmissionsBySubmissionTimeList = maxSubmissionsBySubmissionTime.ToList();

            var values = maxSubmissionsBySubmissionTimeList
                .Skip(1)
                .Select((laterSubmission, index) =>
                {
                    var earlierSubmission = maxSubmissionsBySubmissionTimeList[index];

                    return new ParticipationStatisticsEarlierAndLaterSubmissionModel
                    {
                        EarlierSubmission = earlierSubmission,
                        LaterSubmission = laterSubmission,
                    };
                });

            var result = this.GetTimeTakenAndLengthStatistics(values);

            var earliestSubmission = maxSubmissionsBySubmissionTimeList.First().Submission;
            result[earliestSubmission.Problem.ProblemGroup.OrderBy] = this.GetSubmissionTimeTakenToSolveAndLength(result, earliestSubmission, userStartTime);
            
            return result;
        }

        private Dictionary<int, ParticipantSummarySubmissionInfoServiceModel> GetTimeTakenAndLengthStatistics(
            IEnumerable<ParticipationStatisticsEarlierAndLaterSubmissionModel> submissionPairsValues)
        {
            var resultDict = new Dictionary<int, ParticipantSummarySubmissionInfoServiceModel>();

             submissionPairsValues.ForEach(v =>
             {
                 resultDict[v.LaterSubmission.Submission.Problem.ProblemGroup.OrderBy] =
                     this.GetSubmissionTimeTakenToSolveAndLength(resultDict, v.LaterSubmission.Submission, v.EarlierSubmission.Submission.CreatedOn);
             });
            
            return resultDict;
        }

        private ParticipantSummarySubmissionInfoServiceModel GetSubmissionTimeTakenToSolveAndLength(
            Dictionary<int, ParticipantSummarySubmissionInfoServiceModel> resultDict,
            Submission submission,
            DateTime timeToCompareWith)
        {
            var timeTaken = submission.CreatedOn.GetMinutesDifferenceRounded(timeToCompareWith);
            
            var submissionLength = this.GetSubmissionCodeLength(submission);

            var problemIndex = submission.Problem.ProblemGroup.OrderBy;
                
            if (resultDict.ContainsKey(problemIndex))
            {
                (submissionLength, timeTaken) = this.CalculateSubmissionAverageTimeTakenAndLength(
                    resultDict[problemIndex],
                    timeTaken, 
                    submissionLength);
            }

            return new ParticipantSummarySubmissionInfoServiceModel
            {
                Length = submissionLength,
                TimeTaken = timeTaken
            };
        }

        private Tuple<int, double> CalculateSubmissionAverageTimeTakenAndLength(
            ParticipantSummarySubmissionInfoServiceModel existingValue, 
            double timeTaken, 
            int length)
            => new Tuple<int, double>(
                Convert.ToInt32((existingValue.Length + length) / 2), 
                Math.Round((existingValue.TimeTaken + timeTaken) / 2));

        private int GetSubmissionCodeLength(Submission submission)
            => submission.IsBinaryFile
                ? 0
                : Regex.Matches(submission.ContentAsString, "\n").Count + 1;

        private double CalculateTimeInMinutesFromParticipationStartToLastSubmission(Participant participant)
            => participant.Submissions
                .Select(s => s.CreatedOn)
                .OrderByDescending(s => s)
                .FirstOrDefault()
                .GetMinutesDifferenceRounded(participant.ParticipationStartTime ?? participant.CreatedOn);

        private Dictionary<int, ParticipantSummarySubmissionInfoServiceModel> NormalizeProblemGroupIndexesAndEmptyValues(Dictionary<int, ParticipantSummarySubmissionInfoServiceModel> values, IEnumerable<int> problemGroupsOrderBy)
        {
            var sortedOrderedBy = problemGroupsOrderBy
                .OrderBy(n => n)
                .Distinct()
                .ToList();

            return sortedOrderedBy
                .Select(n => new
                {
                    Key = sortedOrderedBy.IndexOf(n) + 1,
                    Value = values.ContainsKey(n)
                        ? values[n]
                        : new ParticipantSummarySubmissionInfoServiceModel
                        {
                            TimeTaken = 0,
                            Length = 0
                        }
                })
                .ToDictionary(k => k.Key, v => v.Value);
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