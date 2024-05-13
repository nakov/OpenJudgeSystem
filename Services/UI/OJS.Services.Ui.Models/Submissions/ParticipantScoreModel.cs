namespace OJS.Services.Ui.Models.Submissions
{
    using OJS.Data.Models.Participants;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class ParticipantScoreModel : IMapFrom<ParticipantScore>
    {
        public int Points { get; set; }

        public int SubmissionId { get; set; }

        public int ParticipantId { get; set; }
    }
}