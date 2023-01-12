namespace OJS.Servers.Ui.Models.Submissions
{
    using System.ComponentModel.DataAnnotations;

    public class CodeSubmissionRequestModel : BaseSubmissionRequestModel
    {
        [Required]
        [MinLength(5)]
        public string Content { get; set; } = null!;
    }
}