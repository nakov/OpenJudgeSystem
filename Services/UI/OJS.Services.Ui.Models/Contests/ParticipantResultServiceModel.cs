namespace OJS.Services.Ui.Models.Contests;

using AutoMapper;
using OJS.Data.Models.Participants;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;
using System;

public class ParticipantResultServiceModel : IMapExplicitly, IParticipantForActivityServiceModel
{
    public string UserId { get; set; } = string.Empty;

    public int ContestId { get; set; }

    public DateTime? ParticipationStartTime { get; set; }

    public DateTime? ParticipationEndTime { get; set; }

    public DateTime? ContestStartTime { get; set; }

    public DateTime? ContestEndTime { get; set; }

    public DateTime? ContestPracticeStartTime { get; set; }

    public DateTime? ContestPracticeEndTime { get; set; }

    public bool IsInvalidated { get; set; }

    public bool IsOfficial { get; set; }

    public int Points { get; set; }

    public DateTime CreatedOn { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Participant, ParticipantResultServiceModel>()
            .ForMember(
                d => d.Points,
                opt =>
                    opt.MapFrom(src => src.TotalScoreSnapshot))
            .ReverseMap();
}