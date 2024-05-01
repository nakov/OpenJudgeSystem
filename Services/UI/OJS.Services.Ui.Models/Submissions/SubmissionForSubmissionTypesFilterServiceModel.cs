namespace OJS.Services.Ui.Models.Submissions;

using OJS.Data.Models.Submissions;
using OJS.Services.Infrastructure.Models.Mapping;

public class SubmissionForSubmissionTypesFilterServiceModel : IMapFrom<Submission>
{
    public int Id { get; set; }

    public int? SubmissionTypeId { get; set; }
}