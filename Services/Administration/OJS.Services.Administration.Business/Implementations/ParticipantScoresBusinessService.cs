namespace OJS.Services.Administration.Business.Implementations;

using System.Collections.Generic;
using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Helpers;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Data;
using System.Linq;
using System.Threading.Tasks;
using OJS.Data.Models.Participants;

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
    {
        using var scope = TransactionsHelper.CreateLongRunningTransactionScope();

        await this.NormalizeSubmissionPoints();
        await this.NormalizeParticipantScorePoints();

        await this.participantsData.SaveChanges();

        scope.Complete();
    }

    public async Task SaveForSubmission(Submission submission)
    {
        var participant = this.participantsData
            .GetByIdQuery(submission.ParticipantId)
            .Select(p => new
            {
                p.IsOfficial,
                p.User.UserName,
                Participant = p,
            })
            .FirstOrDefault();

        if (participant == null)
        {
            return;
        }

        var existingScore = await this.participantScoresData.GetByParticipantIdProblemIdAndIsOfficial(
            submission.ParticipantId,
            submission.ProblemId,
            participant.IsOfficial);

        if (existingScore == null)
        {
            await this.participantScoresData.AddBySubmissionByUsernameAndIsOfficial(
                submission,
                participant.UserName!,
                participant.IsOfficial,
                participant.Participant);

            return;
        }

        if (submission.Points > existingScore.Points ||
            submission.Id == existingScore.SubmissionId)
        {
            await this.participantScoresData.UpdateBySubmissionAndPoints(
                existingScore,
                submission.Id,
                submission.Points,
                participant.Participant);
        }
    }

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