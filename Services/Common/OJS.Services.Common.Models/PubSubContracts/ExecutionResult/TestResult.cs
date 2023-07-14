namespace OJS.Services.Common.Models.PubSubContracts.ExecutionResult;

public class TestResult
{
    public int Id { get; set; }

    public string? ResultType { get; set; }

    public string? ExecutionComment { get; set; }

    public string? Output { get; set; }

    public CheckerDetails? CheckerDetails { get; set; }

    public int TimeUsed { get; set; }

    public int MemoryUsed { get; set; }
}