namespace OJS.Data.Models.Participants
{
    using OJS.Data.Models.Contests;

    public class ParticipantAnswer
    {
        public int ParticipantId { get; set; }

        public virtual Participant Participant { get; set; } = new();

        public int ContestQuestionId { get; set; }

        public virtual ContestQuestion ContestQuestion { get; set; } = new();

        public string? Answer { get; set; }
    }
}