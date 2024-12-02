namespace OJS.Services.Administration.Business.Implementations;

using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using OJS.Data;
using OJS.Services.Administration.Data;
using System.Threading.Tasks;
using OJS.Data.Models.Participants;
using System.Data;

public class ParticipantScoresBusinessService : IParticipantScoresBusinessService
{
    private readonly IParticipantScoresDataService participantScoresData;
    private readonly IParticipantsDataService participantsData;
    private readonly ISubmissionsDataService submissionsData;
    private readonly ITransactionsProvider transactionsProvider;

    public ParticipantScoresBusinessService(
        IParticipantScoresDataService participantScoresData,
        IParticipantsDataService participantsData,
        ISubmissionsDataService submissionsData,
        ITransactionsProvider transactionsProvider)
    {
        this.participantScoresData = participantScoresData;
        this.participantsData = participantsData;
        this.submissionsData = submissionsData;
        this.transactionsProvider = transactionsProvider;
    }

    public async Task RecalculateForParticipantByProblem(int participantId, int problemId)
    {
        var submission = this.submissionsData.GetBestForParticipantByProblem(participantId, problemId);

        if (submission != null)
        {
            await this.participantScoresData.ResetBySubmission(submission);
        }
        else
        {
            await this.participantScoresData.DeleteForParticipantByProblem(participantId, problemId);
        }
    }

    public async Task NormalizeAllPointsThatExceedAllowedLimit()
        => await this.transactionsProvider.ExecuteInTransaction(async () =>
        {
            await this.NormalizeSubmissionPoints();
            await this.NormalizeParticipantScorePoints();

            await this.participantsData.SaveChanges();
        },
        IsolationLevel.ReadCommitted);

    private async Task NormalizeSubmissionPoints()
    {
        var submissions = await this.submissionsData
            .GetAllHavingPointsExceedingLimit()
            .ToListAsync();

        submissions.ForEach(s => s.Points = s.Problem.MaximumPoints);

        this.submissionsData.UpdateMany(submissions);
    }

    private async Task NormalizeParticipantScorePoints()
    {
        var participantScores = await this.participantScoresData
            .GetAllHavingPointsExceedingLimit()
            .ToListAsync();

        var participants = new List<Participant>();

        foreach (var participantScore in participantScores)
        {
            await this.participantScoresData.UpdateBySubmissionAndPoints(
                participantScore,
                participantScore.SubmissionId,
                participantScore.Problem.MaximumPoints,
                participantScore.Participant,
                shouldSaveChanges: false);

            participants.Add(participantScore.Participant);
        }

        this.participantScoresData.UpdateMany(participantScores);
        this.participantsData.UpdateMany(participants);
    }
}