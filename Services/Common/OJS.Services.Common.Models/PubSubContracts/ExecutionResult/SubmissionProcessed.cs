using System;

namespace OJS.Services.Common.Models.PubSubContracts.ExecutionResult;

public class SubmissionProcessed
{
    // Used for AutoMapper
    public SubmissionProcessed()
    {
    }

    public SubmissionProcessed(int submissionId) => this.SubmissionId = submissionId;

    public int SubmissionId { get; set; }

    public ExceptionModel? Exception { get; set; }

    public ExecutionResult? ExecutionResult { get; set; }

    public void SetExecutionResult(ExecutionResult executionResult)
    {
        this.ExecutionResult = executionResult;
        this.Exception = null;
    }

    public void SetException(Exception exception, bool includeStackTrace)
    {
        this.Exception = new ExceptionModel(exception, includeStackTrace);
        this.ExecutionResult = null;
    }
}