namespace OJS.Services.Busines.Submissions.Models
{
    public class ExceptionModel
    {
        public string Message { get; set; } = null!;

        public string StackTrace { get; set; } = null!;
    }
}