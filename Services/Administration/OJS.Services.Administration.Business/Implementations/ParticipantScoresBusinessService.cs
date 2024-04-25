namespace OJS.Services.Administration.Business.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Helpers;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Data;
using System.Linq;
using System.Threading.Tasks;

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
                participant.UserName,
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
        => await (await this.submissionsData
            .GetAllHavingPointsExceedingLimit()
            .Select(s => new
            {
                Submission = s,
                ProblemMaxPoints = s.Problem!.MaximumPoints,
            })
            .ToListAsync())
            .ForEachSequential(async x =>
            {
                x.Submission.Points = x.ProblemMaxPoints;

                this.submissionsData.Update(x.Submission);
                await this.submissionsData.SaveChanges();
            });

    private async Task NormalizeParticipantScorePoints()
        => await (await this.participantScoresData
            .GetAllHavingPointsExceedingLimit()
            .Select(ps => new
            {
                ParticipantScore = ps,
                ProblemMaxPoints = ps.Problem.MaximumPoints,
            })
            .ToListAsync())
            .ForEachSequential(async x =>
                await this.participantScoresData.UpdateBySubmissionAndPoints(
                    x.ParticipantScore,
                    x.ParticipantScore.SubmissionId,
                    x.ProblemMaxPoints,
                    x.ParticipantScore.Participant));
}