namespace OJS.Services.Administration.Models.Problems;

using AutoMapper;
using Microsoft.AspNetCore.Http;
using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Models.Mapping;
using System;
using System.Collections.Generic;
using OJS.Data.Models.Submissions;

public class ProblemAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string? Name { get; set; }

    public short MaximumPoints { get; set; }

    public int SourceCodeSizeLimit { get; set; }

    public int OrderBy { get; set; }

    public bool ShowResults { get; set; }

    public bool ShowDetailedFeedback { get; set; }

    public int? DefaultSubmissionTypeId { get; set; }

    public virtual SubmissionType DefaultSubmissionType { get; set; } = null!;

    public int CheckerId { get; set; }

    public int ProblemGroupId { get; set; }

    public int ContestId { get; set; }

    public string ContestName { get; set; } = null!;

    public ContestType ContestType { get; set; }

    public double ProblemGroupOrderBy { get; set; }
    public int MemoryLimit { get; set; }

    public int TimeLimit { get; set; }

    public string? ProblemGroupType { get; set; }

    public ICollection<ProblemSubmissionType> SubmissionTypes { get; set; } = [];

    public IFormFile? Tests { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
         configuration.CreateMap<Problem, ProblemAdministrationModel>()
             .ForMember(pam => pam.ContestId, opt
                => opt.MapFrom(p => p.ProblemGroup.ContestId))
             .ForMember(pam => pam.ContestName, opt
                => opt.MapFrom(p => p.ProblemGroup.Contest.Name))
            .ForMember(pam => pam.SubmissionTypes, opt
                => opt.MapFrom(p => p.SubmissionTypesInProblems))
             .ForMember(p => p.OperationType, opt
                 => opt.Ignore())
             .ForMember(pam => pam.Tests, opt
                 => opt.Ignore())
            .ForMember(pam => pam.ProblemGroupType, opt
                => opt.MapFrom(p => Enum.GetName(typeof(ProblemGroupType), p.ProblemGroup.Type ?? OJS.Common.Enumerations.ProblemGroupType.None)))
             .ForMember(pam => pam.ProblemGroupOrderBy, opt
                 => opt.MapFrom(p => p.ProblemGroup.OrderBy))
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
             .ForMember(p => p.AdditionalFiles, opt
                 => opt.Ignore())
             .ForMember(p => p.Tests, opt
                 => opt.Ignore())
             .ForMember(pam => pam.Resources, opt
                 => opt.Ignore())
             .ForMember(pam => pam.Submissions, opt
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