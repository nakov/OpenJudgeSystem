using System.Collections.Generic;

namespace OJS.Services.Business.ParticipantScores.Models
{
    public class ParticipantScoresSummaryModel
    {
        public string ParticipantName { get; set; }
        
        public int ContestId { get; set; }
        
        public string ContestName { get; set; }
        
        public int ProblemsCount { get; set; }

        public int PointsTotal { get; set; }
        
        public double TimeTotal { get; set; }
        
        public Dictionary<int, double> ProblemOrderToMinutesTakenToSolve { get; set; }
        
    }
}