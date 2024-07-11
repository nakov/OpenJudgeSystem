namespace OJS.Services.Administration.Models.SubmissionTypes;

using OJS.Data.Models.Submissions;
using OJS.Workers.Common.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class SubmissionTypeInListModel : IMapFrom<SubmissionType>
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public ExecutionStrategyType ExecutionStrategyType { get; set; }

    public CompilerType CompilerType { get; set; }

    public bool AllowBinaryFilesUpload { get; set; }

    public string? AllowedFileExtensions { get; set; }

    public int? BaseTimeUsedInMilliseconds { get; set; }

    public int? BaseMemoryUsedInBytes { get; set; }

    public int? MaxAllowedTimeLimitInMilliseconds { get; set; }

    public int? MaxAllowedMemoryLimitInBytes { get; set; }
}