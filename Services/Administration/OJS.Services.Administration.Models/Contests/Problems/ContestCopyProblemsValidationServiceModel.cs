namespace OJS.Services.Administration.Models.Contests.Problems;

using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ContestCopyProblemsValidationServiceModel : IMapFrom<Contest>
{
    public int Id { get; set; }

    public string? Name { get; set; }
}