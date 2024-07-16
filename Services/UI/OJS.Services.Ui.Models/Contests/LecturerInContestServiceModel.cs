namespace OJS.Services.Ui.Models.Contests;

using OJS.Data.Models;
using AutoMapper;
using OJS.Services.Infrastructure.Models.Mapping;

public class LecturerInContestServiceModel : IMapExplicitly
{
    public string LecturerId { get; set; } = string.Empty;

    public int ContestId { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<LecturerInContest, LecturerInContestServiceModel>()
            .ReverseMap()
            .ForMember(d => d.ContestId, opt => opt.MapFrom(s => s.ContestId))
            .ForMember(d => d.LecturerId, opt => opt.MapFrom(s => s.LecturerId));
}