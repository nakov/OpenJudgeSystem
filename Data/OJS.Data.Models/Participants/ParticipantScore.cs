namespace OJS.Data.Models.Participants
{
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Problems;
    using OJS.Data.Models.Submissions;

    public class ParticipantScore : Entity<int>
    {
        public int ProblemId { get; set; }

        public virtual Problem? Problem { get; set; }

        public int ParticipantId { get; set; }

        public virtual Participant? Participant { get; set; }

        public int? SubmissionId { get; set; }

        public virtual Submission? Submission { get; set; }

        public string ParticipantName { get; set; } = string.Empty;

        public int Points { get; set; }

        public bool IsOfficial { get; set; }
    }
}