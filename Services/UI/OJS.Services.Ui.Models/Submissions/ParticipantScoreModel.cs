namespace OJS.Services.Ui.Models.Submissions
{
    using OJS.Data.Models.Participants;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public class ParticipantScoreModel : IMapFrom<ParticipantScore>
    {
        public int Points { get; set; }

        public int SubmissionId { get; set; }

        public int ParticipantId { get; set; }
    }
}