using OJS.Data.Models;

namespace OJS.Services.Business.ParticipantScores.Models
{
    public class ParticipantScoreDataModel
    {
        public Participant Participant { get; set; }
        
        public bool IsOfficial { get; set; }

        public string UserName { get; set; }

        public int TotalScore { get; set; }
    }
}