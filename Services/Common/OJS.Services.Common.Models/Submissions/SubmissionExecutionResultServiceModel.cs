namespace OJS.Services.Common.Models.Submissions;

using AutoMapper;
using FluentExtensions.Extensions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionExecutionResultServiceModel : IMapExplicitly
{
    public int SubmissionId { get; set; }

    public string? Exception { get; set; }

    public string? ExecutionResult { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<SubmissionExecutionResult, SubmissionExecutionResultServiceModel>()
            .ForMember(
                d => d.Exception,
                opt => opt.MapFrom(s => s.Exception == null ? null : s.Exception.ToJson()))
            .ForMember(
                d => d.ExecutionResult,
                opt => opt.MapFrom(s => s.ExecutionResult == null ? null : s.ExecutionResult.ToJson()));
}