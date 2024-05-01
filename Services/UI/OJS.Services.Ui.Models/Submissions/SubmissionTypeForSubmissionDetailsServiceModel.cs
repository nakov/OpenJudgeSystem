namespace OJS.Services.Ui.Models.Submissions;

using OJS.Data.Models.Submissions;
using OJS.Services.Infrastructure.Models.Mapping;

public class SubmissionTypeForSubmissionDetailsServiceModel : IMapFrom<SubmissionType>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool AllowBinaryFilesUpload { get; set; }
}