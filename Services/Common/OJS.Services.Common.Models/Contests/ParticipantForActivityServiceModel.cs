namespace OJS.Services.Common.Models.Contests;

using OJS.Data.Models.Participants;
using OJS.Services.Infrastructure.Models.Mapping;
using System;

public class ParticipantForActivityServiceModel : IMapFrom<Participant>
{
    public bool IsInvalidated { get; set; }

    public bool IsOfficial { get; set; }

    public DateTime? ParticipationStartTime { get; set; }

    public DateTime? ParticipationEndTime { get; set; }

    public DateTime? ContestStartTime { get; set; }

    public DateTime? ContestEndTime { get; set; }

    public DateTime? ContestPracticeStartTime { get; set; }

    public DateTime? ContestPracticeEndTime { get; set; }
}