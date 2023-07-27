namespace OJS.Services.Worker.Models.ExecutionResult.Output;

using AutoMapper;
using System.Linq;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;
using OJS.Workers.ExecutionStrategies.Models;

public class TaskResultServiceModel : IMapExplicitly
{
    public int Points { get; set; }

    public IEnumerable<TestResult> TestResults { get; set; } = Enumerable.Empty<TestResult>();

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration
            .CreateMap<ExecutionResult<TestResult>, TaskResultServiceModel>()
            .ForMember(m => m.TestResults, opt => opt.MapFrom(src => src.Results))
            .ForAllOtherMembers(opt => opt.Ignore());
}