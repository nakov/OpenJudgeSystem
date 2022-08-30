using System.Collections.Generic;
using OJS.Data.Models;

namespace OJS.Services.Business.ParticipantScores.Models
{
    public class ParticipantSummaryInfoServiceModel
    {
        public Participant Participant { get; set; }
        
        public Submission LastSubmittedForParticipant { get; set; }
        
        public IEnumerable<MaximumResultSubmissionByProblemServiceModel> MaximumPointsSubmissionsByProblems { get; set; }
    }
}