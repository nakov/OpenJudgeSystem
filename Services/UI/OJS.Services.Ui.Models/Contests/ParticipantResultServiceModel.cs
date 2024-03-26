namespace OJS.Services.Ui.Models.Contests;

using AutoMapper;
using OJS.Data.Models.Participants;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Linq;

public class ParticipantResultServiceModel : IMapExplicitly
{
    public int ContestId { get; set; }

    public int CompetePoints { get; set; }

    public int PracticePoints { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Participant, ParticipantResultServiceModel>()
            .ForMember(
                d => d.PracticePoints,
                opt =>
                    opt.MapFrom(src => src.Scores
                        .Where(s => !s.IsOfficial)
                        .Sum(s => s.Points)))
            .ForMember(
                d => d.CompetePoints,
                opt =>
                    opt.MapFrom(src => src.Scores
                        .Where(s => s.IsOfficial)
                        .Sum(s => s.Points)));
}