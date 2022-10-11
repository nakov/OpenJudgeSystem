namespace OJS.Services.Business.ParticipantScores.Models
{
    using System;
    using System.Collections.Generic;
    using OJS.Data.Models;
    
    public class ParticipantSummaryInfoServiceModel
    {
        public Participant Participant { get; set; }
        
        public double TimeInContest { get; set; }
        
        public DateTime UserStartTime { get; set; }
        
        public List<ProblemGroup> ProblemGroups { get; set; }
        
        public IEnumerable<MaximumResultSubmissionByProblemServiceModel> MaximumPointsSubmissionsByProblems { get; set; }
    }
}