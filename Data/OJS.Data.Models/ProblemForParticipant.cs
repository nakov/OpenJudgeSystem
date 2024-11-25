namespace OJS.Data.Models
{
    using OJS.Data.Models.Common;
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Problems;

    public class ProblemForParticipant : IEntity
    {
        public int ProblemId { get; set; }

        public virtual Problem Problem { get; set; } = null!;

        public int ParticipantId { get; set; }

        public virtual Participant Participant { get; set; } = null!;
    }
}