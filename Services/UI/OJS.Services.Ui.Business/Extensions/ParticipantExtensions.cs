namespace OJS.Services.Ui.Business.Extensions;

using OJS.Data.Models.Participants;
using System;

public static class ParticipantExtensions
{
    public static DateTime? GetParticipationStartTime(this Participant participant)
        => participant.IsOfficial
            ? participant.ParticipationStartTime ?? participant.Contest.StartTime
            : participant.Contest.PracticeStartTime;

    public static DateTime? GetParticipationEndTime(this Participant participant)
        => participant.IsOfficial
            ? participant.ParticipationEndTime ?? participant.Contest.EndTime
            : participant.Contest.PracticeEndTime;
}