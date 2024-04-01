namespace OJS.Services.Administration.Models.ProblemGroups;

using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemGroupDropdownModel : IMapFrom<ProblemGroup>
{
    public int Id { get; set; }

    public double OrderBy { get; set; }
}