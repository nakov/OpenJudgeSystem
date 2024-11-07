namespace OJS.Servers.Worker.Models.ExecutionContext
{
    public class SubmissionCodeRequestModel : SubmissionBaseRequestModel<SubmissionCodeRequestModel, object>
    {
        // [Required]
        public string? Code { get; set; }
    }
}