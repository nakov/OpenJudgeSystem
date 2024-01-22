namespace OJS.Services.Administration.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;
using AutoMapper;
using System.Collections.Generic;
using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;
public class ProblemAdministrationModel : IMapExplicitly
{
    public int? Id { get; set; }

    public string? Name { get; set; }

    public short MaximumPoints { get; set; }

    public int SourceCodeSizeLimit { get; set; }

    public int OrderBy { get; set; }

    public bool ShowResults { get; set; }

    public bool ShowDetailsFeedback { get; set; }

    public int CheckerId { get; set; }

    public string? ProblemGroupId { get; set; }

    public int ContestId { get; set; }

    public int MemoryLimit { get; set; }

    public int TimeLimit { get; set; }

    public ICollection<ProblemSubmissionType> SubmissionTypes { get; set; } = new List<ProblemSubmissionType>();

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<Problem, ProblemAdministrationModel>()
            .ForMember(pam => pam.Id, opt
                => opt.MapFrom(p => p.Id))
            .ForMember(pam => pam.Name, opt
                => opt.MapFrom(p => p.Name))
            .ForMember(pam => pam.MaximumPoints, opt
                => opt.MapFrom(p => p.MaximumPoints))
            .ForMember(pam => pam.SourceCodeSizeLimit, opt
                => opt.MapFrom(p => p.SourceCodeSizeLimit))
            .ForMember(pam => pam.OrderBy, opt
                => opt.MapFrom(p => p.OrderBy))
            .ForMember(pam => pam.ShowResults, opt
                => opt.MapFrom(p => p.ShowResults))
            .ForMember(pam => pam.ShowDetailsFeedback, opt
                => opt.MapFrom(p => p.ShowDetailedFeedback))
            .ForMember(pam => pam.CheckerId, opt
                => opt.MapFrom(p => p.CheckerId))
            .ForMember(pam => pam.ProblemGroupId, opt
                => opt.MapFrom(p => p.ProblemGroupId))
            .ForMember(pam => pam.ContestId, opt
                => opt.MapFrom(p => p.ProblemGroup.ContestId))
            .ForMember(pam => pam.SubmissionTypes, opt
                => opt.MapFrom(p => p.SubmissionTypesInProblems))
            .ForMember(pam => pam.MemoryLimit, opt
                => opt.MapFrom(p => p.MemoryLimit))
            .ForMember(pam => pam.TimeLimit, opt
                => opt.MapFrom(p => p.TimeLimit));
}