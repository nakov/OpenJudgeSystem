using System.Collections.Generic;

namespace OJS.Services.Business.ParticipantScores.Models
{
    public class CategoryContestsParticipationSummary
    {
        public int MaxProblemsCount { get; set; }
        
        public ICollection<ParticipantScoresSummaryModel> Results { get; set; }
    }
}