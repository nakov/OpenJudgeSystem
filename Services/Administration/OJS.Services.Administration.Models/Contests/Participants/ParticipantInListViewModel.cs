namespace OJS.Services.Administration.Models.Contests.Participants;

using AutoMapper;
using OJS.Data.Models.Participants;
using SoftUni.AutoMapper.Infrastructure.Models;
public class ParticipantInListViewModel : IMapExplicitly
{
    public int Id { get; set; }

    public string? UserName { get; set; }

    public string? ContestName { get; set; }

    public string? ContestId { get; set; }
    public bool IsOfficial { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Participant, ParticipantInListViewModel>()
            .ForMember(cvp => cvp.Id, opt
                => opt.MapFrom(x => x.Id))
            .ForMember(cvp => cvp.UserName, opt
                => opt.MapFrom(x => x.User.UserName))
            .ForMember(cvp => cvp.ContestName, opt
                => opt.MapFrom(x => x.Contest.Name))
            .ForMember(cvp => cvp.IsOfficial, opt
                => opt.MapFrom(x => x.IsOfficial));
}