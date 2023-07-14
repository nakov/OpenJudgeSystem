using System;

namespace OJS.Services.Common.Models.PubSubContracts.ExecutionResult;

public class ExecutionResult
{
    public string Id { get; set; } = string.Empty;

    public bool IsCompiledSuccessfully { get; set; }

    public string? CompilerComment { get; set; }

    public TaskResult? TaskResult { get; set; }

    public DateTime? StartedExecutionOn { get; set; }
}