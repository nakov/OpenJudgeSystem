namespace OJS.Services.Common.Models.Submissions.ExecutionContext
{
    public class ExecutionOptionsServiceModel
    {
        public bool KeepDetails { get; set; } = true;

        public bool EscapeTests { get; set; } = true;

        public bool EscapeLineEndings { get; set; } = true;

        public bool KeepCheckerFragmentsForCorrectAnswers { get; set; }
    }
}