namespace OJS.Services.Ui.Models.Submissions;

using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemGroupForSubmissionDetailsServiceModel : IMapFrom<ProblemGroup>
{
    public int ContestId { get; set; }
}