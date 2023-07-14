using OJS.Services.Common.Models.PubSubContracts.ExecutionResult;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Ui.Models.Submissions
{
    using System;

    public class ExecutionResultResponseModel : IMapFrom<ExecutionResult>
    {
        public string Id { get; set; } = null!;

        public bool IsCompiledSuccessfully { get; set; }

        public string CompilerComment { get; set; } = null!;

        public TaskResultResponseModel TaskResult { get; set; } = null!;

        public DateTime? StartedExecutionOn { get; set; }
    }
}