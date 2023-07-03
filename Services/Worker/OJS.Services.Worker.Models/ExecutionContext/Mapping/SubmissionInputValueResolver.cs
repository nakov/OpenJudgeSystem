namespace OJS.Services.Worker.Models.ExecutionContext.Mapping;

using OJS.Workers.Common;
using OJS.Workers.ExecutionStrategies.Models;

public class SubmissionInputValueResolver : IValueResolver<SubmissionServiceModel, IOjsSubmission, object>
{
    public object Resolve(
        SubmissionServiceModel source,
        IOjsSubmission destination,
        object destMember,
        ResolutionContext context)
    {
        switch (source.ExecutionType)
        {
            case ExecutionType.SimpleExecution:
            case ExecutionType.SimpleTemplateExecution:
                return source.SimpleExecutionDetails.Map<SimpleInputModel>();
            case ExecutionType.TestsExecution:
            case ExecutionType.TestsTemplateExecution:
                return source.TestsExecutionDetails.Map<TestsInputModel>();
            default:
                return default;
        }
    }
}
