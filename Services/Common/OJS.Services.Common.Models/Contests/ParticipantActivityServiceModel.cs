namespace OJS.Services.Common.Models.Contests;

using System;

public record ParticipantActivityServiceModel(
    bool HasParticipationTimeLeft,
    bool IsInvalidated,
    DateTime? ParticipationStartTime,
    DateTime? ParticipationEndTime)
{
    public bool IsActive => !this.IsInvalidated && this.HasParticipationTimeLeft;
}