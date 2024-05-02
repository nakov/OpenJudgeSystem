namespace OJS.Services.Ui.Models.Submissions;

using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemGroupForSubmissionDetailsServiceModel : IMapFrom<ProblemGroup>
{
    public int ContestId { get; set; }
}