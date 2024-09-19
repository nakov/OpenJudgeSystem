namespace OJS.Services.Administration.Models.Contests;

using AutoMapper;
using OJS.Data.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class LecturerInContestActionsModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<LecturerInContest, LecturerInContestActionsModel>()
            .ForMember(
                dest => dest.Id,
                opt => opt.MapFrom(
                    s => s.ContestId))
            .ForMember(
                dest => dest.Name,
                opt => opt.MapFrom(
                    s => s.Contest.Name));
}