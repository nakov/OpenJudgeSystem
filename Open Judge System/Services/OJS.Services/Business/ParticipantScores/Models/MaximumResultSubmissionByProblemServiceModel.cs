namespace OJS.Services.Business.ParticipantScores.Models
{
    using OJS.Data.Models;
    
    public class MaximumResultSubmissionByProblemServiceModel
    {
        public int ProblemId { get; set; }
        
        public Submission Submission { get; set; }
    }
}