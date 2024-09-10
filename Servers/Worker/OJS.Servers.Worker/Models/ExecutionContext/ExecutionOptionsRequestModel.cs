namespace OJS.Servers.Worker.Models.ExecutionContext
{
    using OJS.Services.Common.Models.Submissions.ExecutionContext;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class ExecutionOptionsRequestModel : IMapTo<ExecutionOptionsServiceModel>
    {
        public bool KeepDetails { get; set; }

        public bool EscapeTests { get; set; }

        public bool EscapeLineEndings { get; set; }
    }
}