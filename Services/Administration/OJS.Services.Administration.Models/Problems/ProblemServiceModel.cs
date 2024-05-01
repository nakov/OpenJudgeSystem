namespace OJS.Services.Administration.Models.Problems;

using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemServiceModel : IMapFrom<Problem>
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
}