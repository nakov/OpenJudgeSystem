namespace OJS.Services.Administration.Models.SubmissionTypes;

using OJS.Data.Models.Submissions;
using OJS.Workers.Common.Models;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionTypesAdministrationModel : BaseAdministrationModel<int>, IMapFrom<SubmissionType>
{
    public string? Name { get; set; }

    public string? CompilerType { get; set; }

    public string? ExecutionStrategyType { get; set; }

    public bool IsSelectedByDefault { get; set; }

    public bool AllowBinaryFilesUpload { get; set; }

    public string? AdditionalCompilerArguments { get; set; }

    public string? AllowedFileExtensions { get; set; }

    public string? Description { get; set; }
}