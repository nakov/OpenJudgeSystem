namespace OJS.Services.Common.Models.Contests;

using System;

public record ParticipantActivityServiceModel(
    bool HasParticipationTimeLeft,
    bool IsInvalidated,
    DateTime? ParticipationStartTime,
    DateTime? ParticipationEndTime)
{
    /// <summary>
    /// Gets a value indicating whether the participant is active (allowed to participate).
    /// The participant is considered active if it is not invalidated and has participation time left.
    /// </summary>
    public bool IsActive => !this.IsInvalidated && this.HasParticipationTimeLeft;
}