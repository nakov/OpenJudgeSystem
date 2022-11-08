namespace OJS.Services.Business.ParticipantScores.Models
{
    using System.Collections.Generic;
    
    public class ContestParticipationSummary
    {
        public ICollection<ParticipantScoresSummaryModel> Results { get; set; }
    }
}