namespace OJS.Services.Business.ParticipantScores
{
    using System.Linq;

    using OJS.Common.Helpers;
    using OJS.Data.Models;
    using OJS.Services.Data.Participants;
    using OJS.Services.Data.ParticipantScores;
    using OJS.Services.Data.Submissions;

    public class ParticipantScoresBusinessService : IParticipantScoresBusinessService
    {
        private readonly IParticipantScoresDataService participantScoresData;
        private readonly IParticipantsDataService participantsData;
        private readonly ISubmissionsDataService submissionsData;

        public ParticipantScoresBusinessService(
            IParticipantScoresDataService participantScoresData,
            IParticipantsDataService participantsData,
            ISubmissionsDataService submissionsData)
        {
            this.participantScoresData = participantScoresData;
            this.participantsData = participantsData;
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

        public void SaveForSubmission(Submission submission)
        {
            if (submission.ParticipantId == null || submission.ProblemId == null)
            {
                return;
            }

            var participant = this.participantsData
                .GetByIdQuery(submission.ParticipantId.Value)
                .Select(p => new
                {
                    p.IsOfficial,
                    p.User.UserName
                })
                .FirstOrDefault();

            if (participant == null)
            {
                return;
            }

            var existingScore = this.participantScoresData.GetByParticipantIdProblemIdAndIsOfficial(
                submission.ParticipantId.Value,
                submission.ProblemId.Value,
                participant.IsOfficial);

            if (existingScore == null)
            {
                this.participantScoresData.AddBySubmissionByUsernameAndIsOfficial(
                    submission,
                    participant.UserName,
                    participant.IsOfficial);

                return;
            }

            if (submission.Points > existingScore.Points ||
                submission.Id == existingScore.SubmissionId)
            {
                this.participantScoresData.UpdateBySubmissionAndPoints(
                    existingScore,
                    submission.Id,
                    submission.Points);
            }
        }
    }
}