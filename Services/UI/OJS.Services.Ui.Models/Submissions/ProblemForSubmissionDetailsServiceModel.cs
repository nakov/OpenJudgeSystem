namespace OJS.Services.Ui.Models.Submissions;

using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemForSubmissionDetailsServiceModel : IMapFrom<Problem>
{
    public string Name { get; set; } = null!;

    public int Id { get; set; }

    public int ProblemGroupContestId { get; set; }

    public short MaximumPoints { get; set; }
}