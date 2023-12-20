namespace OJS.Workers.SubmissionProcessors.ExecutionTypeFilters
{
    using System.Collections.Generic;
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;
    using OJS.Workers.SubmissionProcessors.Workers;

    public abstract class SubmissionFilteringServiceBase
            : ISubmissionsFilteringService
    {
        protected abstract ISet<ExecutionStrategyType> EnabledExecutionStrategyTypes { get; }

        protected abstract ISet<ExecutionStrategyType> DisabledExecutionStrategyTypes { get; }

        protected abstract ISet<CompilerType> DisabledExecuteAndCompileCompilerTypes { get; }

        public bool CanProcessSubmission(IOjsSubmission submission, ISubmissionWorker submissionWorker)
            => submission != null
                && !this.IsDisabledStrategy(submission)
                && this.IsEnabledStrategy(submission)
                && this.CanProcessSubmissionInternal(submission, submissionWorker)
                && !this.IsDisabledCompilerType(submission);

        protected virtual bool CanProcessSubmissionInternal(IOjsSubmission submission, ISubmissionWorker submissionWorker)
            => true;

        private bool IsDisabledStrategy(IOjsSubmission submission)
            => this.DisabledExecutionStrategyTypes.Count > 0
                 && this.DisabledExecutionStrategyTypes.Contains(submission.ExecutionStrategyType);

        private bool IsEnabledStrategy(IOjsSubmission submission)
        => this.EnabledExecutionStrategyTypes.Count == 0
                || this.EnabledExecutionStrategyTypes.Contains(submission.ExecutionStrategyType);

        private bool IsDisabledCompilerType(IOjsSubmission submission)
            => submission.ExecutionStrategyType is ExecutionStrategyType.CompileExecuteAndCheck &&
               this.DisabledExecuteAndCompileCompilerTypes.Count > 0 &&
               this.DisabledExecuteAndCompileCompilerTypes.Contains(submission.CompilerType);
    }
}
