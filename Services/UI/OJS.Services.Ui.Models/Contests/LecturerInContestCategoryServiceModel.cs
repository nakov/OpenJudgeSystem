namespace OJS.Services.Ui.Models.Contests;

using OJS.Data.Models;
using AutoMapper;
using SoftUni.AutoMapper.Infrastructure.Models;

public class LecturerInContestCategoryServiceModel : IMapExplicitly
{
    public string LecturerId { get; set; } = string.Empty;

    public int ContestCategoryId { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<LecturerInContestCategory, LecturerInContestCategoryServiceModel>()
            .ReverseMap()
            .ForMember(d => d.ContestCategoryId, opt => opt.MapFrom(s => s.ContestCategoryId))
            .ForMember(d => d.LecturerId, opt => opt.MapFrom(s => s.LecturerId))
            .ForAllOtherMembers(opt => opt.Ignore());
}