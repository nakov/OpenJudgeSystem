namespace OJS.Workers.SubmissionProcessors.ExecutionTypeFilters
{
    using System.Collections.Generic;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;
    using OJS.Workers.SubmissionProcessors.Common;
    using OJS.Workers.SubmissionProcessors.Workers;

    using static OJS.Workers.Common.ExecutionStrategiesConstants.NameMappings;

    public class RemoteSubmissionsFilteringService
        : SubmissionFilteringServiceBase
    {
        private readonly HttpService http;

        public RemoteSubmissionsFilteringService()
            => this.http = new HttpService();

        protected override ISet<ExecutionStrategyType> EnabledExecutionStrategyTypes
            => EnabledRemoteWorkerStrategies;

        protected override ISet<ExecutionStrategyType> DisabledExecutionStrategyTypes
            => new HashSet<ExecutionStrategyType>();

        protected override ISet<CompilerType> DisabledExecuteAndCompileCompilerTypes
            => new HashSet<CompilerType>();

        protected override bool CanProcessSubmissionInternal(IOjsSubmission submission, ISubmissionWorker submissionWorker)
            => this.IsOnline(submissionWorker);

        private bool IsOnline(ISubmissionWorker submissionWorker)
        {
            try
            {
                var result = this.http.Get($"{submissionWorker.Location}/health?p433w0rd=h34lth-m0n1t0r1ng");
                return result == "Healthy";
            }
            catch
            {
                return false;
            }
        }
    }
}