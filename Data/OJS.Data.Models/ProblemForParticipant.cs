namespace OJS.Data.Models
{
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Problems;
    using System.ComponentModel.DataAnnotations.Schema;

    public class ProblemForParticipant
    {
        [Column("Problem_Id")]
        public int ProblemId { get; set; }

        public Problem Problem { get; set; }

        [Column("Participant_Id")]
        public int ParticipantId { get; set; }

        public Participant Participant { get; set; }
    }
}