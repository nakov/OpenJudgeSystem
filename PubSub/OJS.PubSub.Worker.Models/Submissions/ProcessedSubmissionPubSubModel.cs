using AutoMapper;
using OJS.Services.Common.Models.Submissions;
using OJS.Workers.SubmissionProcessors.Models;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.PubSub.Worker.Models.Submissions;

public class ProcessedSubmissionPubSubModel : IMapExplicitly
{
    // Used for AutoMapper
    public ProcessedSubmissionPubSubModel()
    {
    }

    public ProcessedSubmissionPubSubModel(int submissionId) => this.Id = submissionId;

    public int Id { get; set; }

    public ExceptionModel? Exception { get; set; }

    public ExecutionResultServiceModel? ExecutionResult { get; set; }

    public void SetExecutionResult(ExecutionResultServiceModel executionResultModel)
    {
        this.ExecutionResult = executionResultModel;
        this.Exception = null;
    }

    public void SetException(Exception exception, bool includeStackTrace)
    {
        this.Exception = new ExceptionModel(exception, includeStackTrace);
        this.ExecutionResult = null;
    }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<ProcessedSubmissionPubSubModel, SubmissionExecutionResult>()
            .ForMember(
                d => d.ExecutionResult,
                opt => opt.MapFrom(s => s.ExecutionResult))
            .ForMember(
                d => d.SubmissionId,
                opt => opt.MapFrom(s => s.Id))
            .ReverseMap();
}