namespace OJS.Services.Common.Models.PubSubContracts.ExecutionResult;

public class SubmissionProcessed
{
    public int SubmissionId { get; set; }

    public ExceptionModel? Exception { get; set; }

    public ExecutionResult? ExecutionResult { get; set; }
}