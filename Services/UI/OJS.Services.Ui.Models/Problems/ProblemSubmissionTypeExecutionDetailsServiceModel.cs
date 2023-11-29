namespace OJS.Services.Ui.Models.Problems;

using OJS.Data.Models;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemSubmissionTypeExecutionDetailsServiceModel : IMapFrom<ProblemSubmissionTypeExecutionDetails>
{
    public int SubmissionTypeId { get; set; }

    public int ProblemId { get; set; }

    public int? TimeLimit { get; set; }

    public int? MemoryLimit { get; set; }
}