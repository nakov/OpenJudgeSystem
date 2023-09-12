namespace OJS.Services.Ui.Models.Contests;

using AutoMapper;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;
using System.Linq;
using Submissions;

public class ContestDetailsServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public bool CanViewResults { get; set; }

    public bool IsOnlineExam { get; set; }

    public bool CanBeCompeted { get; set; }

    public int TotalContestParticipantsCount { get; set; }

    public int ParticipantsCountByContestType { get; set; }

    public ICollection<ContestDetailsSubmissionTypeServiceModel> AllowedSubmissionTypes { get; set; } =
        new HashSet<ContestDetailsSubmissionTypeServiceModel>();

    public ICollection<ContestProblemServiceModel> Problems { get; set; } = new HashSet<ContestProblemServiceModel>();

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<Contest, ContestDetailsServiceModel>()
            .ForMember(
                d => d.Problems,
                opt => opt.MapFrom(s =>
                    s.ProblemGroups
                        .SelectMany(pg => pg.Problems)
                        .OrderBy(p => p.ProblemGroup.OrderBy)
                        .ThenBy(p => p.OrderBy)))
            .ForMember(d => d.CanViewResults, opt => opt.Ignore())
            .ForMember(d => d.AllowedSubmissionTypes, opt => opt.Ignore())
            .ForMember(d => d.TotalContestParticipantsCount, opt => opt.Ignore())
            .ForMember(d => d.ParticipantsCountByContestType, opt => opt.Ignore());
}