namespace OJS.Servers.Worker.Models.ExecutionResult;

using System;
using OJS.Services.Infrastructure.Models.Mapping;
using OJS.Servers.Worker.Models.ExecutionResult.Output;
using OJS.Services.Common.Models.Submissions;

public class ExecutionResultResponseModel : IMapFrom<ExecutionResultServiceModel>
{
    public string? Id { get; set; }

    public bool IsCompiledSuccessfully { get; set; }

    public string? CompilerComment { get; set; }

    public OutputResultResponseModel? OutputResult { get; set; }

    public TaskResultResponseModel? TaskResult { get; set; }
}
