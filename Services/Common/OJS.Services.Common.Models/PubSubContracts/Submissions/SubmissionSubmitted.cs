using OJS.Workers.Common.Models;
using System;

namespace OJS.Services.Common.Models.PubSubContracts.Submissions;

public class SubmissionSubmitted
{
    public int Id { get; set; }

    public ExecutionType ExecutionType { get; set; }

    public ExecutionStrategyType? ExecutionStrategy { get; set; }

    public byte[] Content { get; set; } = Array.Empty<byte>();

    public int TimeLimit { get; set; }

    public int MemoryLimit { get; set; }

    public TestsExecutionDetails? TestsExecutionDetails { get; set; }
}