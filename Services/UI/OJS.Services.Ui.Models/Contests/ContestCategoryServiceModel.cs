namespace OJS.Services.Ui.Models.Contests;

using AutoMapper;
using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;

public class ContestCategoryServiceModel : IMapExplicitly
{
    public int? ParentId { get; set; }

    public bool IsVisible { get; set; }

    public bool AllowMentor { get; set; }

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<ContestCategory, ContestCategoryServiceModel>()
            .ReverseMap();
}