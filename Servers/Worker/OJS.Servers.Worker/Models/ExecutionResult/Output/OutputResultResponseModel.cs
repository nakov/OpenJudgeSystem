namespace OJS.Servers.Worker.Models.ExecutionResult.Output;

using AutoMapper;
using OJS.Workers.ExecutionStrategies.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class OutputResultResponseModel : IMapExplicitly
{
    public int TimeUsedInMs { get; set; }

    public int MemoryUsedInBytes { get; set; }

    public string? ResultType { get; set; }

    public string? Output { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<OutputResult, OutputResultResponseModel>()
            .ForMember(
                m => m.TimeUsedInMs,
                opt => opt.MapFrom(src => src.TimeUsed))
            .ForMember(
                m => m.MemoryUsedInBytes,
                opt => opt.MapFrom(src => src.MemoryUsed))
            .ForMember(
                m => m.ResultType,
                opt => opt.MapFrom(src => src.ResultType.ToString()));
}
