namespace OJS.Services.Common.Models.Mappings;

using AutoMapper;
using OJS.Common.Constants;
using OJS.Services.Common.Models.Submissions.ExecutionDetails;
using OJS.Workers.Checkers;
using OJS.Workers.ExecutionStrategies.Models;
using System.Collections.Generic;

public class CheckerTypeNameValueResolver : IValueResolver<TestsExecutionDetailsServiceModel, TestsInputModel, string>
{
    private readonly Dictionary<string, string> nameToValueMap = new()
    {
        { ServiceConstants.CheckerTypes.Trim, CheckerConstants.TypeNames.Trim },
        { ServiceConstants.CheckerTypes.TrimEnd, CheckerConstants.TypeNames.TrimEnd },
        { ServiceConstants.CheckerTypes.LegacyTrimEnd, CheckerConstants.TypeNames.TrimEnd },
        { ServiceConstants.CheckerTypes.Precision, CheckerConstants.TypeNames.Precision },
        { ServiceConstants.CheckerTypes.CaseInsensitive, CheckerConstants.TypeNames.CaseInsensitive },
        { ServiceConstants.CheckerTypes.LegacyCaseInsensitive, CheckerConstants.TypeNames.CaseInsensitive },
        { ServiceConstants.CheckerTypes.Sort, CheckerConstants.TypeNames.Sort },
        { ServiceConstants.CheckerTypes.ExactMatch, CheckerConstants.TypeNames.ExactMatch },
        { ServiceConstants.CheckerTypes.LegacyExactMatch, CheckerConstants.TypeNames.ExactMatch },
        { ServiceConstants.CheckerTypes.CSharpCode, CheckerConstants.TypeNames.CSharpCode },
        { ServiceConstants.CheckerTypes.LegacyCSharpCode, CheckerConstants.TypeNames.CSharpCoreCode },
        { ServiceConstants.CheckerTypes.CSharpCoreCode, CheckerConstants.TypeNames.CSharpCoreCode },
    };

    private readonly string defaultValue = string.Empty;

    public string Resolve(
        TestsExecutionDetailsServiceModel source,
        TestsInputModel destination,
        string destMember,
        ResolutionContext context)
        => !string.IsNullOrEmpty(source.CheckerType) && this.nameToValueMap.TryGetValue(source.CheckerType, out var value)
            ? value
            : source.CheckerType ?? this.defaultValue;
}