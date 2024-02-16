namespace OJS.Services.Administration.Models.ContestCategories;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ContestCategoriesInContestView : IMapFrom<ContestCategory>
{
    public int Id { get; set; }

    public string? Name { get; set; }
}