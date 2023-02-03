namespace OJS.Services.Ui.Models.Search;

using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
public class ProblemContestSearchServiceModel : IMapFrom<Contest>
{
    public int Id { get; set; }

    public string? Name { get; set; } = null!;

    public bool CanBeCompeted { get; set; }

    public bool CanBePracticed { get; set; }
}