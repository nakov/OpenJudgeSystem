namespace OJS.Services.Administration.Models.ProblemGroups;

using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemGroupDropdownModel : IMapFrom<ProblemGroup>
{
    public int Id { get; set; }

    public double OrderBy { get; set; }
}