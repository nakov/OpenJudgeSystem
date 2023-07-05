namespace OJS.Servers.Worker.Models.ExecutionResult.Output;

using AutoMapper;
using OJS.Workers.ExecutionStrategies.Models;
using SoftUni.AutoMapper.Infrastructure.Models;

public class TestResultResponseModel : IMapFrom<TestResult>, IMapExplicitly
{
    public int Id { get; set; }

    public string? ResultType { get; set; }

    public string? ExecutionComment { get; set; }

    public string? Output { get; set; }

    public int TimeUsed { get; set; }

    public int MemoryUsed { get; set; }

    public CheckerDetailsResponseModel? CheckerDetails { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<TestResult, TestResultResponseModel>()
            .ForMember(
                m => m.ResultType,
                opt => opt.MapFrom(src => src.ResultType.ToString()))
            .ForMember(
                m => m.Output,
                opt => opt.MapFrom(src => src.CheckerDetails.UserOutputFragment));
}