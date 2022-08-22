using System;

namespace OJS.Services.Business.ParticipantScores.Models
{
    public class ParticipantScoresSummary
    {
        public int SubmissionId { get; set; }
        
        public string ProblemName { get; set; }
        
        public int Points { get; set; }
        
        public string CreatedOn { get; set; }
        
        public string ModifiedOn { get; set; }
        
        public string ParticipantName { get; set; }
        
        public int ParticipantId { get; set; }
    }
}