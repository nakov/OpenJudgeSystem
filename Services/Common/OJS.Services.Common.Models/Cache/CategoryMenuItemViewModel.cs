namespace OJS.Services.Common.Models.Cache;

using OJS.Common.Extensions.Strings;
using OJS.Data.Models.Contests;
using System;
using System.Linq.Expressions;

public class CategoryMenuItemViewModel
{
    public static Expression<Func<ContestCategory, CategoryMenuItemViewModel>> FromCategory =>
        category => new CategoryMenuItemViewModel { Id = category.Id, Name = category.Name, };

    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string NameUrl => this.Name.ToUrl();
}