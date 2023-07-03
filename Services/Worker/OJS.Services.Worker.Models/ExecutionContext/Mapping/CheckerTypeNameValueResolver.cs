﻿namespace OJS.Services.Worker.Models.ExecutionContext.Mapping;

using Common;
using System.Collections.Generic;
using OJS.Workers.Checkers;
using OJS.Workers.ExecutionStrategies.Models;
using OJS.Services.Worker.Models.ExecutionContext.ExecutionDetails;

public class CheckerTypeNameValueResolver : IValueResolver<TestsExecutionDetailsServiceModel, TestsInputModel, string>
{
    private readonly IDictionary<string, string> nameToValueMap = new Dictionary<string, string>
    {
        { ServiceConstants.CheckerTypes.Trim, CheckerConstants.TypeNames.Trim },
        { ServiceConstants.CheckerTypes.TrimEnd, CheckerConstants.TypeNames.TrimEnd },
        { ServiceConstants.CheckerTypes.Precision, CheckerConstants.TypeNames.Precision },
        { ServiceConstants.CheckerTypes.CaseInsensitive, CheckerConstants.TypeNames.CaseInsensitive },
        { ServiceConstants.CheckerTypes.Sort, CheckerConstants.TypeNames.Sort },
        { ServiceConstants.CheckerTypes.ExactMatch, CheckerConstants.TypeNames.ExactMatch },
        // This is needed as we have different C# code checkers based on environment:
        // Local workers use CSharpCodeChecker, while interactive uses CSharpCoreCodeChecker
        { ServiceConstants.CheckerTypes.CSharpCode, CheckerConstants.TypeNames.CSharpCoreCode },
    };

    private readonly string defaultValue = null;

    public string Resolve(
        TestsExecutionDetailsServiceModel source,
        TestsInputModel destination,
        string destMember,
        ResolutionContext context)
        => !string.IsNullOrEmpty(source.CheckerType) && this.nameToValueMap.ContainsKey(source.CheckerType)
            ? this.nameToValueMap[source.CheckerType]
                : this.defaultValue;
    }
