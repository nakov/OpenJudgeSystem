using System.Collections.Generic;

namespace OJS.Services.Business.ParticipantScores.Models
{
    public class ParticipationsSummaryServiceModel
    {
        public int ProblemsCount { get; set; }
        
        public ICollection<ParticipantScoresSummaryModel> Results { get; set; }
    }
}