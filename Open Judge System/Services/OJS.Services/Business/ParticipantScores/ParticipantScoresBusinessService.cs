using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data.Entity;
using System.Linq.Dynamic;
using OJS.Services.Business.ParticipantScores.Models;
using OJS.Services.Common;
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
        
        public ServiceResult<ParticipationsSummaryServiceModel> GetParticipationSummary(int id, bool official)
        {
            var participants = this.participantsData
                .GetAllByContestAndIsOfficial(id, official)
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
                
                Dictionary<int, DateTime> problemOrderToFirstBestSubmissionTimeCreated = new Dictionary<int, DateTime>();
                SortedDictionary<int, double> problemOrderToTimeTakenBetweenBest = new SortedDictionary<int, double>();

                if (userScores.Count == 0)
                {
                    results.Add(new ParticipantScoresSummaryModel
                    {
                        ParticipantName = participant.User.UserName,
                        ProblemOrderToMinutesTakenToSolve = problemOrderToTimeTakenBetweenBest,
                        PointsTotal = 0,
                        TimeTotal = 0
                    });
                    continue;
                }

                var participationProblemsForUser = userScores
                    .Select(ps => ps.Problem)
                    .OrderBy(p => p.OrderBy);

                int problemIndex = 0;
                foreach (var problem in participationProblemsForUser)
                {
                    problemIndex++;
                    var problemUserSubmissions =
                        this.submissionsData.GetAllByProblemAndParticipant(problem.Id, participant.Id)
                            .OrderBy(s => s.Points)
                            .OrderBy(s => s.CreatedOn)
                            .ToList();

                    var firstBestSubmissionForProblem = problemUserSubmissions.FirstOrDefault();

                    if (firstBestSubmissionForProblem == null)
                    {
                        continue;
                    }
                    
                    problemOrderToFirstBestSubmissionTimeCreated[problemIndex] = firstBestSubmissionForProblem.CreatedOn;
                }

                var sortedDictionaryKeysList = problemOrderToFirstBestSubmissionTimeCreated
                    .OrderBy(d => d.Value)
                    .Select(x => x.Key)
                    .ToList();

                int keyIndex = 1;
                foreach (var key in sortedDictionaryKeysList)
                {
                    var timeDifference = new TimeSpan?();

                    var firstBestSubmissionTime = problemOrderToFirstBestSubmissionTimeCreated[key];
                    if (keyIndex == 1)
                    {
                        var userTime = participant.ParticipationStartTime == null
                            ? participant.CreatedOn
                            : participant.ParticipationStartTime;
                    
                        timeDifference = firstBestSubmissionTime - userTime;
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
                
                results.Add(new ParticipantScoresSummaryModel
                {
                    ParticipantName = participant.User.UserName,
                    ProblemOrderToMinutesTakenToSolve = problemOrderToTimeTakenBetweenBest,
                    PointsTotal = participant.Scores.Select(s => s.Points).Sum(),
                    TimeTotal = problemOrderToTimeTakenBetweenBest.Values.Sum()
                });
            }

            var contest = this.contestsDataService.GetByIdWithProblemGroups(id);
            var contestProblemGroups = contest.ProblemGroups.Where(pg => !pg.IsDeleted).ToList();

            return ServiceResult<ParticipationsSummaryServiceModel>.Success(new ParticipationsSummaryServiceModel
            {
                Results = results,
                ProblemsCount = contestProblemGroups.Count()
            });
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