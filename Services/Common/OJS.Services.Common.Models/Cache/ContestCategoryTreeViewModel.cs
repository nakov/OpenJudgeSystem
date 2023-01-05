using FluentExtensions.Extensions;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Extensions;

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

    public int? ParentId { get; set; }

    public double OrderBy { get; set; }

    public IEnumerable<ContestCategoryTreeViewModel> Children { get; set; }
        = Enumerable.Empty<ContestCategoryTreeViewModel>();

    public ICollection<AllowedContestStrategiesServiceModel> AllowedStrategyTypes { get; set; }


    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<ContestCategory, ContestCategoryTreeViewModel>()
            .ForMember(
                m => m.Children,
                opt => opt.MapFrom(src =>
                    src.Children
                    .Where(c => c.IsVisible)))
            .ForMember(
                m => m.AllowedStrategyTypes,
                opt => opt.MapFrom(src =>
                    src.Contests
                        .Where(cc => cc.IsVisible && !cc.IsDeleted)
                        .SelectMany(c => c.ProblemGroups)
                            .Where(pg => !pg.IsDeleted)
                        .SelectMany(pg => pg.Problems)
                            .Where(p => !p.IsDeleted)
                        .SelectMany(p => p.SubmissionTypesInProblems)
                        .Select(st => st.SubmissionType)
                        .Distinct()));

}