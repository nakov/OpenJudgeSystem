using OJS.Data.Models;

namespace OJS.Services.Business.ParticipantScores.Models
{
    public class MaximumResultSubmissionByProblemServiceModel
    {
        public int ProblemId { get; set; }
        
        public Submission Submission { get; set; }
    }
}