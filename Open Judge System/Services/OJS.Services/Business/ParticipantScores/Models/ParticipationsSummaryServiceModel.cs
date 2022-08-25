using System.Collections.Generic;

namespace OJS.Services.Business.ParticipantScores.Models
{
    public class ParticipationsSummaryServiceModel
    {
        public int ContestId { get; set; }
        
        public string ContestName { get; set; }
        
        public int ProblemsCount { get; set; }
        
        public ICollection<ParticipantScoresSummaryModel> Results { get; set; }
    }
}