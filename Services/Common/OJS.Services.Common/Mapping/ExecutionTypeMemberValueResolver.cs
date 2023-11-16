namespace OJS.Services.Common.Mapping;

using OJS.Workers.Common.Models;
using System.Collections.Generic;
using OJS.Common.Constants;

public class ExecutionTypeMemberValueResolver : ValuesMapOrDefaultMemberValueResolver<string, ExecutionType>
{
    protected override IDictionary<string, ExecutionType> NameToValueMap { get; } = new Dictionary<string, ExecutionType>
    {
        { ServiceConstants.CodeExecutionContext.ExecutionTypeNames.SimpleExecution, ExecutionType.SimpleExecution },
        { ServiceConstants.CodeExecutionContext.ExecutionTypeNames.SimpleTemplateExecution, ExecutionType.SimpleTemplateExecution },
        { ServiceConstants.CodeExecutionContext.ExecutionTypeNames.TestsExecution, ExecutionType.TestsExecution },
        { ServiceConstants.CodeExecutionContext.ExecutionTypeNames.TestsTemplateExecution, ExecutionType.TestsTemplateExecution },
    };

    protected override ExecutionType DefaultValue { get; } = ExecutionType.NotFound;
}