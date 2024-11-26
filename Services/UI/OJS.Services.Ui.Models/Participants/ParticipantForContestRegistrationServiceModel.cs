namespace OJS.Services.Ui.Models.Participants;

using OJS.Data.Models.Participants;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;
using System;

public class ParticipantForContestRegistrationServiceModel : IMapFrom<Participant>, IParticipantForActivityServiceModel
{
    public int Id { get; set; }

    public bool IsInvalidated { get; set; }

    public bool IsOfficial { get; set; }

    public int ContestId { get; set; }

    public DateTime? ParticipationStartTime { get; set; }

    public DateTime? ParticipationEndTime { get; set; }

    public DateTime? ContestStartTime { get; set; }

    public DateTime? ContestEndTime { get; set; }

    public DateTime? ContestPracticeStartTime { get; set; }

    public DateTime? ContestPracticeEndTime { get; set; }
}