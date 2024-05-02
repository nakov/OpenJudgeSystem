namespace OJS.Services.Administration.Models.ContestCategories;
using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;

public class ContestCategoriesInContestView : IMapFrom<ContestCategory>
{
    public int Id { get; set; }

    public string? Name { get; set; }
}