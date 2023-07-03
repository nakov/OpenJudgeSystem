namespace OJS.Services.Worker.Models.ExecutionResult.Output;

using System.Collections.Generic;
using OJS.Workers.ExecutionStrategies.Models;

public class TaskResultServiceModel
    : IMapFrom<ExecutionResult<TestResult>>,
    IMapTo<TaskResultPubSubModel>,
    IMapExplicitly
{
    public int Points { get; set; }

    public IEnumerable<TestResult> TestResults { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration
            .CreateMap<ExecutionResult<TestResult>, TaskResultServiceModel>()
            .ForMember(m => m.TestResults, opt => opt.MapFrom(src => src.Results));
        configuration
            .CreateMap<TestResult, TestResultPubSubModel>()
            .ForMember(m => m.ExpectedOutputFragment, opt => opt.MapFrom(src => src.CheckerDetails.ExpectedOutputFragment))
            .ForMember(m => m.ActualOutputFragment, opt => opt.MapFrom(src => src.CheckerDetails.UserOutputFragment))
            .ForMember(m => m.Comment, opt => opt.MapFrom(src => src.CheckerDetails.Comment));
    }
}

