using System.Collections.Generic;
using System.Data.Entity;
using OJS.Common;
using OJS.Data.Models;
using OJS.Services.Business.ParticipantScores.Models;
using OJS.Services.Common;

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

        public ParticipantScoresBusinessService(
            IParticipantScoresDataService participantScoresData,
            ISubmissionsDataService submissionsData)
        {
            this.participantScoresData = participantScoresData;
            this.submissionsData = submissionsData;
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
        
        public ServiceResult<ICollection<ParticipantScoresSummary>> GetParticipationSummary(int id, bool official)
        {
            var participations = this.participantScoresData
                .GetAll()
                .Include(ps => ps.Submission)
                .Include(ps => ps.Submission.Problem)
                .Include(ps => ps.Participant)
                .Where(ps => !ps.Submission.IsDeleted)
                .Where(ps => ps.Submission != null)
                .Where(ps => ps.IsOfficial == official)
                .Where(ps => ps.Participant.ContestId == id)
                .Select(ps => new ParticipantScoresSummary
                {
                    SubmissionId = ps.SubmissionId.Value,
                    ProblemName = ps.Submission.Problem.Name,
                    Points = ps.Points,
                    CreatedOn = ps.Submission.CreatedOn.ToString(),
                    ModifiedOn = ps.Submission.ModifiedOn.ToString(),
                    ParticipantName = ps.ParticipantName,
                    ParticipantId = ps.ParticipantId
                })
                .ToList();
            
            return ServiceResult<ICollection<ParticipantScoresSummary>>.Success(participations);
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