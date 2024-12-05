namespace OJS.Services.Ui.Models.Cache;

using AutoMapper;
using OJS.Data.Models.Submissions;
using OJS.Services.Infrastructure.Models.Mapping;
using OJS.Workers.Common.Models;

public class SubmissionTypeCacheModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ExecutionStrategyType ExecutionStrategyType { get; set; }

    public CompilerType CompilerType { get; set; }

    public string? AdditionalCompilerArguments { get; set; }

    public string? Description { get; set; }

    public bool AllowBinaryFilesUpload { get; set; }

    public string? AllowedFileExtensions { get; set; }

    public int? BaseTimeUsedInMilliseconds { get; set; }

    public int? BaseMemoryUsedInBytes { get; set; }

    public int? MaxAllowedTimeLimitInMilliseconds { get; set; }

    public int? MaxAllowedMemoryLimitInBytes { get; set; }

    public string FileNameExtension { get; set; } = string.Empty;

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<SubmissionType, SubmissionTypeCacheModel>()
            .ReverseMap();
}