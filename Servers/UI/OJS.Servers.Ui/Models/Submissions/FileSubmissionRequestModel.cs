namespace OJS.Servers.Ui.Models.Submissions
{
    using Microsoft.AspNetCore.Http;
    using Newtonsoft.Json;
    using System.ComponentModel.DataAnnotations;

    public class FileSubmissionRequestModel : BaseSubmissionRequestModel
    {
        [Required]
        [JsonIgnore]
        public IFormFile File { get; set; } = null!;
    }
}