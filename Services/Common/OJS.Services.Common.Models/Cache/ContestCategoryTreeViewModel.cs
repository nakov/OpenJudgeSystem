namespace OJS.Services.Common.Models.Cache;

using AutoMapper;
using OJS.Common.Extensions.Strings;
using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;
using System.Collections.Generic;
using System.Linq;

public class ContestCategoryTreeViewModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string NameUrl => this.Name.ToUrl();

    public int? ParentId { get; set; }

    public double OrderBy { get; set; }

    public bool AllowMentor { get; set; }

    public IEnumerable<ContestCategoryTreeViewModel> Children { get; set; } = [];

    public IEnumerable<AllowedContestStrategiesServiceModel> AllowedStrategyTypes { get; set; } = [];

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<ContestCategory, ContestCategoryTreeViewModel>()
            .ForMember(
                m => m.AllowedStrategyTypes,
                opt => opt.Ignore());
}