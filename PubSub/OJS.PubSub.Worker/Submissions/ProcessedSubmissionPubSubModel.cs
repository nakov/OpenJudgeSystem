namespace OJS.PubSub.Worker.Submissions;

using AutoMapper;
using OJS.Services.Common.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using OJS.Workers.SubmissionProcessors.Models;

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

    public void SetExecutionResult(ExecutionResultServiceModel executionResultPubSubModel)
    {
        this.ExecutionResult = executionResultPubSubModel;
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
            .ReverseMap();
}