using OJS.Workers.Common.Models;

namespace OJS.Services.Worker.Models.ExecutionContext.Mapping;

using AutoMapper;
using OjsExecutionType = Workers.Common.Models.ExecutionType;

public class ExecutionTypeValueResolver : IValueResolver<SubmissionServiceModel, object, OjsExecutionType>
{
    public OjsExecutionType Resolve(
        SubmissionServiceModel source,
        object destination,
        OjsExecutionType destMember,
        ResolutionContext context)
    {
        switch (source.ExecutionType)
        {
            case OjsExecutionType.SimpleExecution:
            case ExecutionType.SimpleTemplateExecution:
                return OjsExecutionType.SimpleExecution;

            case ExecutionType.TestsExecution:
            case ExecutionType.TestsTemplateExecution:
                return OjsExecutionType.TestsExecution;

            case ExecutionType.NotFound:
            default:
                return OjsExecutionType.NotFound;
        }
    }
}