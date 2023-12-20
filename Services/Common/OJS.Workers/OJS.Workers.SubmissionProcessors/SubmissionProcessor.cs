#nullable disable
namespace OJS.Workers.SubmissionProcessors
{
    using System;
    using System.Collections.Concurrent;
    using System.Threading;

    using log4net;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.SubmissionProcessors.ExecutionTypeFilters;
    using OJS.Workers.SubmissionProcessors.Models;
    using OJS.Workers.SubmissionProcessors.Workers;

    public class SubmissionProcessor<TSubmission> : ISubmissionProcessor
    {
        private readonly object sharedLockObject;
        private readonly ISubmissionsFilteringService submissionsFilteringService;
        private readonly IDependencyContainer dependencyContainer;
        private readonly ConcurrentQueue<TSubmission> submissionsForProcessing;
        private bool stopping;

        public SubmissionProcessor(
            string name,
            IDependencyContainer dependencyContainer,
            ConcurrentQueue<TSubmission> submissionsForProcessing,
            object sharedLockObject,
            ISubmissionsFilteringService submissionsFilteringService,
            ISubmissionWorker submissionWorker)
        {
            this.Name = name;

            this.Logger = LogManager.GetLogger(typeof(SubmissionProcessor<TSubmission>));
            this.Logger.Info($"{nameof(SubmissionProcessor<TSubmission>)} initializing...");

            this.stopping = false;

            this.dependencyContainer = dependencyContainer;
            this.submissionsForProcessing = submissionsForProcessing;
            this.sharedLockObject = sharedLockObject;
            this.submissionsFilteringService = submissionsFilteringService;
            this.SubmissionWorker = submissionWorker;

            this.Logger.Info($"{nameof(SubmissionProcessor<TSubmission>)} initialized.");
        }

        public string Name { get; set; }

        protected ILog Logger { get; set; }

        protected ISubmissionProcessingStrategy<TSubmission> SubmissionProcessingStrategy { get; set; }

        protected ISubmissionWorker SubmissionWorker { get; private set; }

        public void Start()
        {
            this.Logger.Info($"{nameof(SubmissionProcessor<TSubmission>)} starting...");

            while (!this.stopping)
            {
                using (this.dependencyContainer.BeginDefaultScope())
                {
                    this.SubmissionProcessingStrategy = this.GetSubmissionProcessingStrategyInstance();

                    var submission = this.GetSubmissionForProcessing();

                    if (submission != null)
                    {
                        this.ProcessSubmission(submission);
                    }
                    else
                    {
                        Thread.Sleep(this.SubmissionProcessingStrategy.JobLoopWaitTimeInMilliseconds);
                    }
                }
            }

            this.Logger.Info($"{nameof(SubmissionProcessor<TSubmission>)} stopped.");
        }

        public void Stop() => this.stopping = true;

        protected IExecutionResult<TResult> HandleProcessSubmission<TInput, TResult>(
            OjsSubmission<TInput> submission)
            where TResult : class, ISingleCodeRunResult, new()
            => this.SubmissionWorker.RunSubmission<TInput, TResult>(submission);

        protected void BeforeExecute(IOjsSubmission submission)
        {
            try
            {
                this.SubmissionProcessingStrategy.BeforeExecute();
            }
            catch (Exception ex)
            {
                submission.ProcessingComment = $"Exception before executing the submission: {ex.Message}";
                submission.ExceptionType = ExceptionType.Strategy;

                throw new Exception($"Exception in {nameof(this.SubmissionProcessingStrategy.BeforeExecute)}", ex);
            }
        }

        protected void ProcessExecutionResult<TOutput>(IExecutionResult<TOutput> executionResult, IOjsSubmission submission)
            where TOutput : ISingleCodeRunResult, new()
        {
            try
            {
                this.SubmissionProcessingStrategy.ProcessExecutionResult(executionResult);
            }
            catch (Exception ex)
            {
                submission.ProcessingComment = $"Exception in processing execution result: {ex.Message}";
                submission.ExceptionType = ExceptionType.Strategy;
                throw new Exception($"Exception in {nameof(this.ProcessExecutionResult)}", ex);
            }
        }

        private IOjsSubmission GetSubmissionForProcessing()
        {
            try
            {
                var submission = this.SubmissionProcessingStrategy.RetrieveSubmission();

                if (submission == null)
                {
                    return null;
                }

                if (!this.submissionsFilteringService.CanProcessSubmission(submission, this.SubmissionWorker))
                {
                    this.SubmissionProcessingStrategy.ReleaseSubmission();
                    return null;
                }

                return submission;
            }
            catch (Exception ex)
            {
                this.Logger.Fatal("Unable to get submission for processing.", ex);
                throw;
            }
        }

        private void ProcessSubmission<TInput, TResult>(OjsSubmission<TInput> submission)
            where TResult : class, ISingleCodeRunResult, new()
        {
            this.Logger.Info($"{this.Name}({this.SubmissionWorker.Location}): Work on submission #{submission.Id} started.");

            this.BeforeExecute(submission);

            var executionResult = this.HandleProcessSubmission<TInput, TResult>(submission);

            this.Logger.Info($"{this.Name}({this.SubmissionWorker.Location}): Work on submission #{submission.Id} ended.");

            this.ProcessExecutionResult(executionResult, submission);

            this.Logger.Info($"{this.Name}({this.SubmissionWorker.Location}): Submission #{submission.Id} successfully processed.");
        }

        private ISubmissionProcessingStrategy<TSubmission> GetSubmissionProcessingStrategyInstance()
        {
            try
            {
                var processingStrategy = this.dependencyContainer
                    .GetInstance<ISubmissionProcessingStrategy<TSubmission>>();

                processingStrategy.Initialize(
                    this.Logger,
                    this.submissionsForProcessing,
                    this.sharedLockObject);

                return processingStrategy;
            }
            catch (Exception ex)
            {
                this.Logger.Fatal("Unable to initialize submission processing strategy.", ex);
                throw;
            }
        }

        // Overload accepting IOjsSubmission and doing cast, because upon getting the submission,
        // TInput is not known and no specific type could be given to the generic ProcessSubmission<>
        private void ProcessSubmission(IOjsSubmission submission)
        {
            try
            {
                switch (submission.ExecutionType)
                {
                    case ExecutionType.TestsExecution:
                        var testsSubmission = (OjsSubmission<TestsInputModel>)submission;
                        this.ProcessSubmission<TestsInputModel, TestResult>(testsSubmission);
                        break;

                    case ExecutionType.SimpleExecution:
                        var simpleSubmission = (OjsSubmission<string>)submission;
                        this.ProcessSubmission<string, OutputResult>(simpleSubmission);
                        break;

                    default:
                        throw new ArgumentOutOfRangeException(
                            nameof(submission.ExecutionType),
                            "Invalid execution type!");
                }
            }
            catch (Exception ex)
            {
                this.Logger.Error(
                    $"{nameof(this.ProcessSubmission)} on submission #{submission.Id} has thrown an exception:",
                    ex);

                this.SubmissionProcessingStrategy.OnError(submission, ex);
            }
        }
    }
}
