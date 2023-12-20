namespace OJS.Workers.SubmissionProcessors.ExecutionTypeFilters
{
    using OJS.Workers.Common;
    using OJS.Workers.SubmissionProcessors.Workers;

    public interface ISubmissionsFilteringService
    {
        bool CanProcessSubmission(IOjsSubmission submission, ISubmissionWorker submissionWorker);
    }
}
