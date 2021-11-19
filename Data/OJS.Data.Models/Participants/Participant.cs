namespace OJS.Data.Models.Participants
{
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Submissions;
    using OJS.Data.Models.Users;
    using System;
    using System.Collections.Generic;

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

        public Contest Contest { get; set; }

        public string UserId { get; set; }

        public UserProfile User { get; set; }

        public DateTime? ParticipationStartTime { get; set; }

        public DateTime? ParticipationEndTime { get; set; }

        public bool IsOfficial { get; set; }

        public bool IsInvalidated { get; set; }

        public ICollection<Submission> Submissions { get; set; } = new HashSet<Submission>();

        public ICollection<ParticipantScore> Scores { get; set; } = new HashSet<ParticipantScore>();

        public ICollection<ProblemForParticipant> ProblemsForParticipants { get; set; } =
            new HashSet<ProblemForParticipant>();

        public virtual ICollection<ParticipantAnswer> Answers { get; set; } = new HashSet<ParticipantAnswer>();
    }
}