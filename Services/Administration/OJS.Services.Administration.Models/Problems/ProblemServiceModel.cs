namespace OJS.Services.Administration.Models.Problems;

using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemServiceModel : IMapFrom<Problem>
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
}