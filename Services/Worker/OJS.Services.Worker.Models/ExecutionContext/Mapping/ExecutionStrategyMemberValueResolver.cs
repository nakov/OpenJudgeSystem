namespace OJS.Services.Worker.Models.ExecutionContext.Mapping;

using OJS.Services.Common.Mapping;
using System.Collections.Generic;
using OJS.Workers.Common.Models;
using static Workers.Common.ExecutionStrategiesConstants.NameMappings;

public class ExecutionStrategyMemberValueResolver
    : ValuesMapOrDefaultMemberValueResolver<string, ExecutionStrategyType>
{
    protected override IDictionary<string, ExecutionStrategyType> NameToValueMap
        => NameToExecutionStrategyMappings;

    protected override ExecutionStrategyType DefaultValue
        => ExecutionStrategyType.NotFound;
}
