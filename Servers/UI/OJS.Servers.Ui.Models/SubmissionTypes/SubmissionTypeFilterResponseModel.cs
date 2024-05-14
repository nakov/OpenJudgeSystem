namespace OJS.Servers.Ui.Models.SubmissionTypes;

using OJS.Services.Ui.Models.SubmissionTypes;
using OJS.Services.Infrastructure.Models.Mapping;

public class SubmissionTypeFilterResponseModel : IMapFrom<SubmissionTypeFilterServiceModel>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
}