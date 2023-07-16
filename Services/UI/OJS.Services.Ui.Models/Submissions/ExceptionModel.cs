namespace OJS.Services.Ui.Models.Submissions
{
    public class ExceptionModel
    {
        public string Message { get; set; } = null!;

        public string StackTrace { get; set; } = null!;
    }
}