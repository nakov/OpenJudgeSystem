namespace OJS.Services.Administration.Models.Contests.Participants;

using AutoMapper;
using OJS.Data.Models.Participants;
using OJS.Services.Infrastructure.Models.Mapping;
using System;

public class ParticipantInListViewModel : IMapExplicitly
{
    public int Id { get; set; }

    public string? UserName { get; set; }

    public string? ContestName { get; set; }

    public string? ContestId { get; set; }

    public bool IsOfficial { get; set; }

    public bool IsInvalidated { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

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