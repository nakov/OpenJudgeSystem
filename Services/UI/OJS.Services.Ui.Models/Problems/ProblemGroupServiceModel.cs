namespace OJS.Services.Ui.Models.Problems;

using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Models.Mapping;
using System.Collections.Generic;

public class ProblemGroupServiceModel : IMapFrom<ProblemGroup>
{
    public ICollection<ContestDetailsProblemServiceModel> Problems { get; set; } = new HashSet<ContestDetailsProblemServiceModel>();
}