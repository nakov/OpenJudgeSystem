namespace OJS.Services.Administration.Models.Contests.Problems;

using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;

public class ContestCopyProblemsValidationServiceModel : IMapFrom<Contest>
{
    public int Id { get; set; }

    public string? Name { get; set; }
}