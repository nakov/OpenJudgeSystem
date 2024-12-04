namespace OJS.Common.Enumerations;

public enum SubmissionProcessingState
{
    Invalid = 0,
    Pending = 1,
    Enqueued = 2,
    Processing = 3,
    Processed = 4,
    Faulted = 5,
}