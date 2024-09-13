namespace OJS.Services.Administration.Models.ContestCategories;

using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;
using System.Collections.Generic;

public class ContestCategoriesHierarchyModel : IMapFrom<ContestCategory>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int? ParentId { get; set; }

    public double OrderBy { get; set; }

    public IEnumerable<ContestCategoriesHierarchyModel> Children { get; set; } = [];
}