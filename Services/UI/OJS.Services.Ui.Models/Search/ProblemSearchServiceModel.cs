namespace OJS.Services.Ui.Models.Search;

using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemSearchServiceModel : IMapFrom<Problem>
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
}