namespace OJS.Services.Administration.Models.Participants;

using AutoMapper;
using OJS.Services.Infrastructure.Models.Mapping;
using OJS.Data.Models.Participants;

public class ParticipantServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public string UserName { get; set; } = string.Empty;

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Participant, ParticipantServiceModel>()
            .ForMember(
                d => d.UserName,
                opt => opt.MapFrom(s => s.User.UserName));
}