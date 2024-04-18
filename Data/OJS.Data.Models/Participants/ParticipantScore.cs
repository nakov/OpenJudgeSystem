namespace OJS.Data.Models.Participants
{
    using OJS.Data.Models.Problems;
    using OJS.Data.Models.Submissions;
    using OJS.Data.Infrastructure.Models;

    public class ParticipantScore : Entity<int>
    {
        public int ProblemId { get; set; }

        public virtual Problem Problem { get; set; } = null!;

        public int ParticipantId { get; set; }

        public virtual Participant Participant { get; set; } = null!;

        public int? SubmissionId { get; set; }

        public virtual Submission? Submission { get; set; }

        public string ParticipantName { get; set; } = string.Empty;

        public int Points { get; set; }

        public bool IsOfficial { get; set; }
    }
}