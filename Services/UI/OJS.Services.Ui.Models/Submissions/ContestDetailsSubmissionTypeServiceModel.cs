namespace OJS.Services.Ui.Models.Submissions;

using OJS.Services.Infrastructure.Models.Mapping;
using OJS.Services.Ui.Models.SubmissionTypes;

public class ContestDetailsSubmissionTypeServiceModel : IMapFrom<SubmissionTypeServiceModel>
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
}