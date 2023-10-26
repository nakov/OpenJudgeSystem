namespace OJS.Services.Common.Mapping;

using System.Collections.Generic;
using OJS.Workers.Common.Models;
using OJS.Workers.Common;

public class ExecutionStrategyValueResolver : ValuesMapOrDefaultMemberValueResolver<string, ExecutionStrategyType>
{
    protected override IDictionary<string, ExecutionStrategyType> NameToValueMap =>
       ExecutionStrategiesConstants.NameMappings.NameToExecutionStrategyMappings;

    protected override ExecutionStrategyType DefaultValue => ExecutionStrategyType.NotFound;
}