namespace OJS.Data.Models
{
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Problems;

    public class ProblemForParticipant
    {
        public int ProblemId { get; set; }

        public virtual Problem Problem { get; set; }

        public int ParticipantId { get; set; }

        public virtual Participant Participant { get; set; }
    }
}