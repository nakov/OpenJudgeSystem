namespace OJS.Services.Administration.Models.LecturerInContests;

using AutoMapper;
using OJS.Data.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class LecturerInContestInListModel : IMapExplicitly
{
    public int ContestId { get; set; }

    public string? ContestName { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsVisible { get; set; }

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<LecturerInContest, LecturerInContestInListModel>()
            .ForMember(leincm => leincm.IsDeleted, opt
                => opt.MapFrom(lic => lic.Contest.IsDeleted))
            .ForMember(leincm => leincm.IsVisible, opt
                => opt.MapFrom(lic => lic.Contest.IsVisible));
}