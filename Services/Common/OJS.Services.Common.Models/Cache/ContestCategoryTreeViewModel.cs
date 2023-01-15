using AutoMapper;
using OJS.Common.Extensions.Strings;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;
using System.Linq;

namespace OJS.Services.Common.Models.Cache;

public class ContestCategoryTreeViewModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string NameUrl => this.Name.ToUrl();

    public int? ParentId { get; set; }

    public double OrderBy { get; set; }

    public IEnumerable<ContestCategoryTreeViewModel> Children { get; set; }
        = Enumerable.Empty<ContestCategoryTreeViewModel>();

    public IEnumerable<AllowedContestStrategiesServiceModel> AllowedStrategyTypes { get; set; }
        = Enumerable.Empty<AllowedContestStrategiesServiceModel>();


    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<ContestCategory, ContestCategoryTreeViewModel>()
            .ForMember(
                m => m.AllowedStrategyTypes,
                opt => opt.Ignore());
}