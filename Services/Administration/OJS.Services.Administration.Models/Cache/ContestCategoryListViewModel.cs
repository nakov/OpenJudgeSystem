namespace OJS.Services.Administration.Models.Cache;

using OJS.Common.Extensions.Strings;
using OJS.Data.Models.Contests;
using System;
using System.Linq;
using System.Linq.Expressions;

public class ContestCategoryListViewModel
{
    public static Expression<Func<ContestCategory, ContestCategoryListViewModel>> FromCategory =>
        category => new ContestCategoryListViewModel
        {
            Id = category.Id,
            Name = category.Name,
            HasChildren = category.Children.Any(x => x.IsVisible && !x.IsDeleted)
        };

    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string NameUrl => this.Name.ToUrl();

    public bool HasChildren { get; set; }
}