using System.Collections.Generic;

namespace OJS.Services.Business.ParticipantScores.Models
{
    public class ParticipantScoresSummaryModel
    {
        public string ParticipantName { get; set; }

        public int PointsTotal { get; set; }
        
        public double TimeTotal { get; set; }
        
        public SortedDictionary<int, double> ProblemOrderToMinutesTakenToSolve { get; set; }
    }
}