namespace OJS.Servers.Ui.Models.Submissions
{
    public abstract class BaseSubmissionRequestModel
    {
        public int ProblemId { get; set; }

        public int SubmissionTypeId { get; set; }

        public bool IsOfficial { get; set; }
    }
}