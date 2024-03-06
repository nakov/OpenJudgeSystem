namespace OJS.Services.Administration.Models.Problems;

using SoftUni.AutoMapper.Infrastructure.Models;
using AutoMapper;
using System.Collections.Generic;
using OJS.Data.Models.Problems;
using OJS.Common.Enumerations;
using System;
using Microsoft.AspNetCore.Http;

public class ProblemAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string? Name { get; set; }

    public short MaximumPoints { get; set; }

    public int SourceCodeSizeLimit { get; set; }

    public int OrderBy { get; set; }

    public bool ShowResults { get; set; }

    public bool ShowDetailedFeedback { get; set; }

    public int CheckerId { get; set; }

    public string? ProblemGroupId { get; set; }

    public int ContestId { get; set; }

    public ContestType ContestType { get; set; }

    public double ProblemGroupOrderBy { get; set; }
    public int MemoryLimit { get; set; }

    public int TimeLimit { get; set; }

    public string? ProblemGroupType { get; set; }

    public ICollection<ProblemSubmissionType> SubmissionTypes { get; set; } = new List<ProblemSubmissionType>();

    public IFormFile? Tests { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
         configuration.CreateMap<Problem, ProblemAdministrationModel>()
             .ForMember(pam => pam.ContestId, opt
                => opt.MapFrom(p => p.ProblemGroup.ContestId))
            .ForMember(pam => pam.SubmissionTypes, opt
                => opt.MapFrom(p => p.SubmissionTypesInProblems))
             .ForMember(pam => pam.Tests, opt
                 => opt.Ignore())
            .ForMember(pam => pam.ProblemGroupType, opt
                => opt.MapFrom(p => Enum.GetName(typeof(ProblemGroupType), p.ProblemGroup.Type ?? OJS.Common.Enumerations.ProblemGroupType.None)))
             .ForMember(pam => pam.ContestType, opt
             => opt.MapFrom(p => p.ProblemGroup.Contest.Type));

         configuration.CreateMap<ProblemAdministrationModel, Problem>()
             .ForMember(pam => pam.SubmissionTypesInProblems, opt
                 => opt.Ignore())
             .ForMember(pam => pam.ProblemGroup, opt
                 => opt.Ignore())
             .ForMember(pam => pam.Checker, opt
                 => opt.Ignore())
             .ForMember(pam => pam.SolutionSkeleton, opt
                 => opt.Ignore())
             .ForMember(p => p.Tests, opt
                 => opt.Ignore())
             .ForMember(pam => pam.Resources, opt
                 => opt.Ignore())
             .ForMember(pam => pam.Submissions, opt
                 => opt.Ignore())
             .ForMember(pam => pam.TagsInProblems, opt
                 => opt.Ignore())
             .ForMember(pam => pam.ParticipantScores, opt
                 => opt.Ignore())
             .ForMember(pam => pam.ProblemsForParticipants, opt
                 => opt.Ignore())
             .ForMember(pam => pam.IsDeleted, opt
                 => opt.Ignore())
             .ForMember(pam => pam.DeletedOn, opt
                 => opt.Ignore())
             .ForMember(pam => pam.CreatedOn, opt
                 => opt.Ignore())
             .ForMember(pam => pam.ModifiedOn, opt
                 => opt.Ignore())
             .ForMember(pam => pam.AdditionalFiles, opt
             => opt.Ignore());
    }
}