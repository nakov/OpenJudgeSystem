#nullable disable
namespace OJS.Workers.SubmissionProcessors
{
    using System;
    using System.Collections.Concurrent;

    using log4net;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Exceptions;
    using OJS.Workers.ExecutionStrategies.Models;

    public abstract class SubmissionProcessingStrategy<TSubmission> : ISubmissionProcessingStrategy<TSubmission>
    {
        public int JobLoopWaitTimeInMilliseconds { get; protected set; } =
            Constants.DefaultJobLoopWaitTimeInMilliseconds;

        protected ILog Logger { get; private set; }

        protected ConcurrentQueue<TSubmission> SubmissionsForProcessing { get; private set; }

        protected object SharedLockObject { get; private set; }

        public virtual void Initialize(
            ILog logger,
            ConcurrentQueue<TSubmission> submissionsForProcessing,
            object sharedLockObject)
        {
            this.Logger = logger;
            this.SubmissionsForProcessing = submissionsForProcessing;
            this.SharedLockObject = sharedLockObject;
        }

        public void ProcessExecutionResult<TResult>(IExecutionResult<TResult> executionResult)
            where TResult : ISingleCodeRunResult, new()
        {
            switch (executionResult)
            {
                case IExecutionResult<TestResult> testsExecutionResult:
                    this.ProcessTestsExecutionResult(testsExecutionResult);
                    break;
                case IExecutionResult<OutputResult> outputExecutionResult:
                    this.ProcessOutputExecutionResult(outputExecutionResult);
                    break;
                default:
                    throw new ArgumentException("Invalid execution result", nameof(executionResult));
            }
        }

        public abstract void BeforeExecute();

        public abstract IOjsSubmission RetrieveSubmission();

        public abstract void OnError(IOjsSubmission submission, Exception ex);

        public abstract void SetSubmissionToProcessing();

        public abstract void ReleaseSubmission();

        protected virtual void ProcessTestsExecutionResult(IExecutionResult<TestResult> testsExecutionResult) =>
            throw new DerivedImplementationNotFoundException();

        protected virtual void ProcessOutputExecutionResult(IExecutionResult<OutputResult> outputExecutionResult) =>
            throw new DerivedImplementationNotFoundException();
    }
}
