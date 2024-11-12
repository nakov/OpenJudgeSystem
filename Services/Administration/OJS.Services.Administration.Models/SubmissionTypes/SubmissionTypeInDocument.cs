namespace OJS.Services.Administration.Models.SubmissionTypes;

using OJS.Data.Models.Submissions;
using OJS.Services.Infrastructure.Models.Mapping;

public class SubmissionTypeInDocument : IMapFrom<SubmissionType>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
}