namespace OJS.Services.Common.Models.Submissions;

using AutoMapper;
using FluentExtensions.Extensions;
using OJS.Services.Infrastructure.Models.Mapping;

public class SerializedSubmissionExecutionResultServiceModel : IMapExplicitly
{
    public int SubmissionId { get; set; }

    public string? SerializedException { get; set; }

    public string? SerializedExecutionResult { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<SubmissionExecutionResult, SerializedSubmissionExecutionResultServiceModel>()
            .ForMember(
                d => d.SerializedException,
                opt => opt.MapFrom(s => s.Exception == null ? null : s.Exception.ToJson()))
            .ForMember(
                d => d.SerializedExecutionResult,
                opt => opt.MapFrom(s => s.ExecutionResult == null ? null : s.ExecutionResult.ToJson()));
}