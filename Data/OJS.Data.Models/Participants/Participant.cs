namespace OJS.Data.Models.Participants
{
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Submissions;
    using OJS.Data.Models.Users;
    using System;
    using System.Collections.Generic;
    using OJS.Data.Models.Common;

    public class Participant : AuditInfoEntity<int>
    {
        public Participant()
        {
        }

        public Participant(int contestId, string userId, bool isOfficial)
        {
            this.ContestId = contestId;
            this.UserId = userId;
            this.IsOfficial = isOfficial;
        }

        public int ContestId { get; set; }

        public virtual Contest Contest { get; set; } = null!;

        public string UserId { get; set; } = string.Empty;

        public virtual UserProfile User { get; set; } = null!;

        public DateTime? ParticipationStartTime { get; set; }

        public DateTime? ParticipationEndTime { get; set; }

        public bool IsOfficial { get; set; }

        public bool IsInvalidated { get; set; }

        public int TotalScoreSnapshot { get; set; }

        public DateTime? TotalScoreSnapshotModifiedOn { get; set; }

        public virtual ICollection<Submission> Submissions { get; set; } = new HashSet<Submission>();

        public virtual ICollection<ParticipantScore> Scores { get; set; } = new HashSet<ParticipantScore>();

        public virtual ICollection<ProblemForParticipant> ProblemsForParticipants { get; set; } =
            new HashSet<ProblemForParticipant>();

        public override string ToString() => this.UserId;
    }
}