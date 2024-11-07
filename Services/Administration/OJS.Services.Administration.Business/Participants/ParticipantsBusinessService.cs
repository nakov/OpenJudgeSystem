namespace OJS.Services.Administration.Business.Participants;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Participants;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class ParticipantsBusinessService : AdministrationOperationService<Participant, int, ParticipantAdministrationModel>, IParticipantsBusinessService
{
    private readonly IParticipantsDataService participantsData;
    private readonly IParticipantScoresDataService scoresDataService;
    private readonly IContestsDataService contestsDataService;

    public ParticipantsBusinessService(
        IParticipantsDataService participantsData,
        IParticipantScoresDataService scoresDataService,
        IContestsDataService contestsDataService)
    {
        this.participantsData = participantsData;
        this.scoresDataService = scoresDataService;
        this.contestsDataService = contestsDataService;
    }

    public override async Task<ParticipantAdministrationModel> Create(ParticipantAdministrationModel model)
    {
        var participant = model.Map<Participant>();

        await this.participantsData.Add(participant);
        await this.participantsData.SaveChanges();

        return model;
    }

    public override async Task Delete(int id)
    {
        await this.participantsData.DeleteById(id);
        await this.participantsData.SaveChanges();
    }

    public async Task UpdateTotalScoreSnapshotOfParticipants()
        => await this.participantsData.UpdateTotalScoreSnapshot();

    public async Task RemoveDuplicateParticipantScores()
    {
        var duplicateGroups = await this.scoresDataService
            .GetQuery()
            .GroupBy(ps => new { ps.IsOfficial, ps.ProblemId, ps.ParticipantId })
            .Where(psGroup => psGroup.Count() > 1)
            .Select(psGroup => new
            {
                GroupKey = psGroup.Key,
                ScoresToRemove = psGroup
                    .OrderByDescending(ps => ps.Points)
                    .Skip(1),
            })
            .ToListAsync();

        var participantScoresToRemove = duplicateGroups
            .SelectMany(group => group.ScoresToRemove)
            .ToList();

        await this.scoresDataService.Delete(participantScoresToRemove);
    }

    public IQueryable<Participant> GetByContest(int contestId)
        => this.participantsData.GetAllByContest(contestId);

    public async Task<string> UpdateParticipationTimeForMultipleParticipants(
        ChangeParticipationTimeForMultipleParticipantsModel model)
    {
        if (!model.ChangeParticipationTimeRangeStart.HasValue)
        {
            throw new BusinessServiceException("Invalid date for \"Created After\" has been provided!");
        }

        if (!model.ChangeParticipationTimeRangeEnd.HasValue)
        {
            throw new BusinessServiceException("Invalid date for \"Created Before\" has been provided!");
        }

        if (model.ChangeParticipationTimeRangeEnd < model.ChangeParticipationTimeRangeStart)
        {
            throw new BusinessServiceException("Participants \"Created After\" must be earlier than participants \"Created Before\".");
        }

        var contest = await this.contestsDataService.GetByIdQuery(model.ContestId).FirstOrDefaultAsync();

        var contestDurationInMinutes = contest!.Duration!.Value.Minutes;

        var participantsInTimeRange = this.participantsData
            .GetAllOfficialInOnlineContestByContestAndParticipationStartTimeRange(
                model.ContestId,
                (DateTime)model.ChangeParticipationTimeRangeStart,
                (DateTime)model.ChangeParticipationTimeRangeEnd);

        var invalidParticipantsUsernames = await participantsInTimeRange
            .Where(p => p.ParticipationEndTime.HasValue && p.ParticipationStartTime.HasValue &&
                        p.ParticipationEndTime.Value.AddMinutes(model.TimeInMinutes) <
                        p.ParticipationStartTime.Value.AddMinutes(contestDurationInMinutes))
            .Select(p => p.User.UserName)
            .ToListAsync();

        var participantsToUpdate = await participantsInTimeRange
            .Where(p => p.ParticipationEndTime.HasValue && p.ParticipationStartTime.HasValue &&
                        p.ParticipationEndTime.Value.AddMinutes(model.TimeInMinutes) >=
                        p.ParticipationStartTime.Value.AddMinutes(contestDurationInMinutes))
            .ToListAsync();

        foreach (var participant in participantsToUpdate)
        {
            participant.ParticipationEndTime = participant.ParticipationEndTime!.Value.AddMinutes(model.TimeInMinutes);
        }

        await this.participantsData.SaveChanges();

        var sb = new StringBuilder();

        var action = model.TimeInMinutes < 0 ? "subtracted" : "added";
        var preposition = model.TimeInMinutes < 0 ? "from" : "to";
        var successMessage = $"Successfully {action} {Math.Abs(model.TimeInMinutes)} minutes {preposition} the times of all selected active participants ({participantsToUpdate.Count}) in the contest: {model.ContestName}.";
        sb.AppendLine(successMessage);

        if (invalidParticipantsUsernames.Count > 0)
        {
            var unsuccessfulMessage = $"WARNING: The following users' contest duration was not updated because their contest duration would have been reduced below the base contest duration: {string.Join(", ", invalidParticipantsUsernames)}";
            sb.AppendLine(unsuccessfulMessage);
        }

        return sb.ToString();
    }

    public async Task<string> UpdateParticipationTimeForSingleParticipant(
        ChangeParticipationTimeForSingleParticipantModel model)
    {
        if (string.IsNullOrWhiteSpace(model.UserId))
        {
            throw new BusinessServiceException("The participant's id is invalid!");
        }

        var participant = await this.participantsData
            .GetByContestByUserAndByIsOfficial(model.ContestId, model.UserId, isOfficial: true);

        if (participant == null)
        {
            throw new BusinessServiceException("The participant is not in the contest.");
        }

        if (!participant.ParticipationStartTime.HasValue ||
            !participant.ParticipationEndTime.HasValue)
        {
            throw new BusinessServiceException("The participant's participation time has not been set!");
        }

        var newEndTime = participant.ParticipationEndTime.Value.AddMinutes(model.TimeInMinutes);
        var minAllowedEndTime = participant.ParticipationStartTime.Value
            .AddMinutes(participant.Contest.Duration!.Value.TotalMinutes);

        if (newEndTime < minAllowedEndTime)
        {
            throw new BusinessServiceException("Participant's time cannot be reduced, because it will be below the contest's duration!");
        }

        participant.ParticipationEndTime = newEndTime;

        await this.participantsData.SaveChanges();

        var action = model.TimeInMinutes < 0 ? "subtracted" : "added";
        var preposition = model.TimeInMinutes < 0 ? "from" : "to";
        return $"Successfully {action} {Math.Abs(model.TimeInMinutes)} minutes {preposition} the time of the participant with username: {model.Username}, in the contest: {model.ContestName}.";
    }
}