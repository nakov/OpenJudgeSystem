namespace OJS.Services.Common.Models.Cache;

using AutoMapper;
using OJS.Common.Extensions.Strings;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Linq;

public class ContestCategoryListViewModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string NameUrl => this.Name.ToUrl();

    public bool HasChildren { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<ContestCategory, ContestCategoryListViewModel>()
            .ForMember(
                m => m.HasChildren,
                opt => opt.MapFrom(src => src.Children.Any(x => x.IsVisible)));
}