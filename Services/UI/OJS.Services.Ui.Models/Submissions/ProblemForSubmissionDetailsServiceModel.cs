namespace OJS.Services.Ui.Models.Submissions;

using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemForSubmissionDetailsServiceModel : IMapFrom<Problem>
{
    public string Name { get; set; } = null!;

    public int Id { get; set; }

    public ProblemGroupForSubmissionDetailsServiceModel ProblemGroup { get; set; } = null!;

    public bool ShowResults { get; set; }
}