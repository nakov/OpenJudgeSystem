namespace OJS.Services.Common.Models.Cache;

using AutoMapper;
using OJS.Common.Extensions.Strings;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;
using System.Linq;

public class ContestCategoryTreeViewModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string NameUrl => this.Name.ToUrl();

    public IEnumerable<ContestCategoryTreeViewModel> Children { get; set; }
        = Enumerable.Empty<ContestCategoryTreeViewModel>();

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<ContestCategory, ContestCategoryTreeViewModel>()
            .ForMember(
                m => m.Children,
                opt => opt.MapFrom(src =>
                    src.Children
                        .Where(c => c.IsVisible)
                        .OrderBy(c=> c.OrderBy)));
}