namespace OJS.Services.Ui.Models.Cache;

using AutoMapper;
using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemGroupCacheModel : IMapExplicitly
{
    public int Id { get; set; }

    public int ContestId { get; set; }

    public double OrderBy { get; set; }

    public ProblemGroupType? Type { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<ProblemGroup, ProblemGroupCacheModel>()
            .ReverseMap();
}