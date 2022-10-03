using OJS.Services.Ui.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Servers.Ui.Models.Problems;

public class ProblemResultResponseModel : IMapFrom<ProblemResultServiceModel>
{
    public int ProblemId { get; set; }

    public int SubmissionId { get; set; }

    public short MaximumPoints { get; set; }

    public int Points { get; set; }
}