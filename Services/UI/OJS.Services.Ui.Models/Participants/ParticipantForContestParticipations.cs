namespace OJS.Services.Ui.Models.Participants;

using OJS.Data.Models.Contests;
using OJS.Data.Models.Participants;
using OJS.Services.Ui.Models.Submissions;
using OJS.Data.Models.Users;
using OJS.Services.Infrastructure.Models.Mapping;
using System;
using System.Collections.Generic;

public class ParticipantForContestParticipations : IMapFrom<Participant>
{
    public int ContestId { get; set; }

    public virtual Contest Contest { get; set; } = null!;

    public string UserId { get; set; } = string.Empty;

    public virtual UserProfile User { get; set; } = null!;

    public DateTime? ParticipationStartTime { get; set; }

    public DateTime? ParticipationEndTime { get; set; }

    public bool IsOfficial { get; set; }

    public bool IsInvalidated { get; set; }

    public virtual ICollection<SubmissionForContestParticipations> Submissions { get; set; }
        = new HashSet<SubmissionForContestParticipations>();

    public override string ToString() => this.UserId;
}