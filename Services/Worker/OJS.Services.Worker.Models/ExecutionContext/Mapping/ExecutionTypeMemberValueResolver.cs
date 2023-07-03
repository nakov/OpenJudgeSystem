namespace OJS.Services.Worker.Models.ExecutionContext.Mapping;

using OJS.Services.Common.Mapping;
using System.Collections.Generic;
using static OJS.Services.Common.ServiceConstants.CodeExecutionContext.ExecutionTypeNames;

public class ExecutionTypeMemberValueResolver : ValuesMapOrDefaultMemberValueResolver<string, ExecutionType>
{
    protected override IDictionary<string, ExecutionType> NameToValueMap { get; }
        = new Dictionary<string, ExecutionType>
        {
            { SimpleExecution, ExecutionType.SimpleExecution },
            { SimpleTemplateExecution, ExecutionType.SimpleTemplateExecution },
            { TestsExecution, ExecutionType.TestsExecution },
            { TestsTemplateExecution, ExecutionType.TestsTemplateExecution },
        };

    protected override ExecutionType DefaultValue
        => ExecutionType.NotFound;
}

