namespace OJS.Services.Worker.Models.ExecutionContext
{
    public class ExecutionOptionsServiceModel
    {
        public bool KeepDetails { get; set; }

        public bool EscapeTests { get; set; }

        public bool EscapeLineEndings { get; set; }

        public bool KeepCheckerFragmentsForCorrectAnswers { get; set; }
    }
}