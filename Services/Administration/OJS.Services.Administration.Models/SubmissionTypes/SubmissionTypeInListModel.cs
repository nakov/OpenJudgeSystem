namespace OJS.Services.Administration.Models.SubmissionTypes;

using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionTypeInListModel : IMapFrom<SubmissionType>
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? ExecutionStrategyType { get; set; }

    public string? CompilerType { get; set; }

    public bool AllowBinaryFilesUpload { get; set; }

    public string? AllowedFileExtensions { get; set; }
}