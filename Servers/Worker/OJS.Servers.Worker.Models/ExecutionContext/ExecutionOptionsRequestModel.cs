namespace OJS.Servers.Worker.Models.ExecutionContext
{
    using OJS.Services.Common.Models.Submissions.ExecutionContext;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class ExecutionOptionsRequestModel : IMapTo<ExecutionOptionsServiceModel>
    {
        public bool KeepDetails { get; set; } = false;

        public bool EscapeTests { get; set; } = true;

        public bool EscapeLineEndings { get; set; } = false;

        public bool KeepCheckerFragmentsForCorrectAnswers { get; set; } = true;
    }
}