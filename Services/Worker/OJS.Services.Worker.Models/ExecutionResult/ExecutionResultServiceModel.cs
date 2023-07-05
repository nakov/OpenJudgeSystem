namespace OJS.Services.Worker.Models.ExecutionResult;

using System;
using System.Linq;
using AutoMapper;
using SoftUni.AutoMapper.Infrastructure.Models;
using OJS.Services.Worker.Models.ExecutionResult.Output;
using OJS.Workers.ExecutionStrategies.Models;

public class ExecutionResultServiceModel : IMapExplicitly
{
    public string? Id { get; set; }

    public bool IsCompiledSuccessfully { get; set; }

    public string? CompilerComment { get; set; }

    public OutputResult? OutputResult { get; set; }

    public TaskResultServiceModel? TaskResult { get; set; }

    public DateTime? StartedExecutionOn { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap(typeof(ExecutionResult<>), typeof(ExecutionResultServiceModel))
            .ForMember(
                nameof(this.OutputResult),
                opt => opt.MapFrom(src => ((src as ExecutionResult<OutputResult>) !).Results.FirstOrDefault()))
            .ForMember(
                nameof(this.TaskResult),
                opt => opt.MapFrom(src => src as ExecutionResult<TestResult>));
}