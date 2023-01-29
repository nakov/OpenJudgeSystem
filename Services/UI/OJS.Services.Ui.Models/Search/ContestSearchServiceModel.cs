namespace OJS.Services.Ui.Models.Search;

using SoftUni.AutoMapper.Infrastructure.Models;
using OJS.Data.Models.Contests;

public class ContestSearchServiceModel : IMapFrom<Contest>
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
}