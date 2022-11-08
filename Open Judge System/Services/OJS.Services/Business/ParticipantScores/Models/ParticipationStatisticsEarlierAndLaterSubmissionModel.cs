using OJS.Data.Models;

namespace OJS.Services.Business.ParticipantScores.Models
{
    public class ParticipationStatisticsEarlierAndLaterSubmissionModel
    {
        public MaximumResultSubmissionByProblemServiceModel EarlierSubmission { get; set; }
        
        public MaximumResultSubmissionByProblemServiceModel LaterSubmission { get; set; }
    }
}