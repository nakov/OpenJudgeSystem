namespace OJS.Servers.Worker.Models.ExecutionContext
{
    using OJS.Services.Common.Models.Submissions.ExecutionContext;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public class ExecutionOptionsRequestModel : IMapTo<ExecutionOptionsServiceModel>
    {
        public bool KeepDetails { get; set; } = false;

        public bool EscapeTests { get; set; } = true;

        public bool EscapeLineEndings { get; set; } = false;

        public bool KeepCheckerFragmentsForCorrectAnswers { get; set; } = true;
    }
}