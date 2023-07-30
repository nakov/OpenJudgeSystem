using AutoMapper;
using OJS.Workers.ExecutionStrategies.Models;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;
using System.Linq;

namespace OJS.Services.Common.Models.Submissions;

public class TaskResultServiceModel : IMapExplicitly
{
    public int Points { get; set; }

    public IEnumerable<TestResultServiceModel> TestResults { get; set; } = Enumerable.Empty<TestResultServiceModel>();

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap(typeof(ExecutionResult<TestResult>), typeof(TaskResultServiceModel))
            .ForMember(
                nameof(this.Points),
                // Calculated later on in code
                opt => opt.Ignore())
            .ForMember(
                nameof(this.TestResults),
                opt => opt.MapFrom(src => ((src as ExecutionResult<TestResult>) !).Results));
}