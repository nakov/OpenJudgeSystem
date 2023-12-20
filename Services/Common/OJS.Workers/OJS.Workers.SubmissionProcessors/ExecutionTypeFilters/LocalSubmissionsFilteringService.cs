namespace OJS.Workers.SubmissionProcessors.ExecutionTypeFilters
{
    using System.Collections.Generic;
    using OJS.Workers.Common.Models;
    using static OJS.Workers.Common.ExecutionStrategiesConstants.NameMappings;

    public class LocalSubmissionsFilteringService
        : SubmissionFilteringServiceBase
    {
        protected override ISet<ExecutionStrategyType> EnabledExecutionStrategyTypes
            => new HashSet<ExecutionStrategyType>();

        protected override ISet<ExecutionStrategyType> DisabledExecutionStrategyTypes
            => DisabledLocalWorkerStrategies;

        protected override ISet<CompilerType> DisabledExecuteAndCompileCompilerTypes
            => DisabledLocalWorkerExecuteAndCompileTypes;
    }
}