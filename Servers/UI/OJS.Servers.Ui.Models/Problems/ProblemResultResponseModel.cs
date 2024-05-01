namespace OJS.Servers.Ui.Models.Problems;

using OJS.Services.Ui.Models.Problems;
using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemResultResponseModel : IMapFrom<ProblemResultServiceModel>
{
    public int ProblemId { get; set; }

    public int SubmissionId { get; set; }

    public short MaximumPoints { get; set; }

    public int Points { get; set; }
}