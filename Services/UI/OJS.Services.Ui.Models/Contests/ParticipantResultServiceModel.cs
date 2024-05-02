namespace OJS.Services.Ui.Models.Contests;

using AutoMapper;
using OJS.Data.Models.Participants;
using OJS.Services.Infrastructure.Models.Mapping;
using System;
using System.Linq;

public class ParticipantResultServiceModel : IMapExplicitly
{
    public int ContestId { get; set; }

    public bool IsOfficial { get; set; }

    public int Points { get; set; }

    public DateTime CreatedOn { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Participant, ParticipantResultServiceModel>()
            .ForMember(
                d => d.Points,
                opt =>
                    opt.MapFrom(src => src.TotalScoreSnapshot));
}