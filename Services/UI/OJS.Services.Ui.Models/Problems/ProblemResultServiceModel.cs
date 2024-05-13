namespace OJS.Services.Ui.Models.Problems;

using AutoMapper;
using OJS.Data.Models.Participants;
using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemResultServiceModel : IMapExplicitly
{
    public int ProblemId { get; set; }

    public int SubmissionId { get; set; }

    public short MaximumPoints { get; set; }

    public int Points { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<ParticipantScore, ProblemResultServiceModel>()
            .ForMember(d => d.ProblemId, opt => opt.MapFrom(s => s.Problem.Id))
            .ForMember(d => d.MaximumPoints, opt => opt.MapFrom(s => s.Problem.MaximumPoints));
}