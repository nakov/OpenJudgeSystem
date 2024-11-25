namespace OJS.Services.Common.Models.Contests;

using System;

public interface IParticipantForActivityServiceModel
{
    bool IsInvalidated { get; set; }

    bool IsOfficial { get; set; }

    int ContestId { get; set; }

    DateTime? ParticipationStartTime { get; set; }

    DateTime? ParticipationEndTime { get; set; }

    DateTime? ContestStartTime { get; set; }

    DateTime? ContestEndTime { get; set; }

    DateTime? ContestPracticeStartTime { get; set; }

    DateTime? ContestPracticeEndTime { get; set; }
}