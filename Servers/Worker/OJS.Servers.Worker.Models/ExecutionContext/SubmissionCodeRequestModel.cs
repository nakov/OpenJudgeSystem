namespace OJS.Servers.Worker.Models.ExecutionContext
{
    using System;

    public class SubmissionCodeRequestModel : SubmissionBaseRequestModel<SubmissionCodeRequestModel, object>
    {
        // [Required]
        public string? Code { get; set; }
    }
}