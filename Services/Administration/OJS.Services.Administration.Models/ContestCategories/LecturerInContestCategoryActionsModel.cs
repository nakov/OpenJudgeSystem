namespace OJS.Services.Administration.Models.ContestCategories;

using AutoMapper;
using OJS.Data.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class LecturerInContestCategoryActionsModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<LecturerInContestCategory, LecturerInContestCategoryActionsModel>()
            .ForMember(
                dest => dest.Id,
                opt => opt.MapFrom(
                    s => s.ContestCategoryId))
            .ForMember(
                dest => dest.Name,
                opt => opt.MapFrom(
                    s => s.ContestCategory.Name));
}