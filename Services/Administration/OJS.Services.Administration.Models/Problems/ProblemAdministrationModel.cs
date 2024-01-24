namespace OJS.Services.Administration.Models.Problems;

using SoftUni.AutoMapper.Infrastructure.Models;
using AutoMapper;
using System.Collections.Generic;
using OJS.Data.Models.Problems;
using FluentValidation;
using OJS.Data.Validation;
using OJS.Services.Common.Validation;
using OJS.Common.Enumerations;
using System;
using Microsoft.AspNetCore.Http;

public class ProblemAdministrationModel : IMapExplicitly
{
    public int? Id { get; set; }

    public string? Name { get; set; }

    public short MaximumPoints { get; set; }

    public int SourceCodeSizeLimit { get; set; }

    public int OrderBy { get; set; }

    public bool ShowResults { get; set; }

    public bool ShowDetailedFeedback { get; set; }

    public int CheckerId { get; set; }

    public string? ProblemGroupId { get; set; }

    public int ContestId { get; set; }

    public int MemoryLimit { get; set; }

    public int TimeLimit { get; set; }

    public string? ProblemGroupType { get; set; }

    // public byte[]? AdditionalFiles { get; set; }
    public ICollection<ProblemSubmissionType> SubmissionTypes { get; set; } = new List<ProblemSubmissionType>();

    public void RegisterMappings(IProfileExpression configuration)
    {
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
            .ForMember(pam => pam.ShowDetailedFeedback, opt
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
                => opt.MapFrom(p => p.TimeLimit))
            // .ForMember(pam => pam.AdditionalFiles, opt
            //     => opt.MapFrom(p => p.AdditionalFiles))
            .ForMember(pam => pam.ProblemGroupType, opt
                => opt.MapFrom(p => Enum.GetName(typeof(ProblemGroupType), p.ProblemGroup.Type ?? OJS.Common.Enumerations.ProblemGroupType.None)));

         configuration.CreateMap<ProblemAdministrationModel, Problem>()
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
             .ForMember(pam => pam.ShowDetailedFeedback, opt
                 => opt.MapFrom(p => p.ShowDetailedFeedback))
             .ForMember(pam => pam.CheckerId, opt
                 => opt.MapFrom(p => p.CheckerId))
             .ForMember(pam => pam.ProblemGroupId, opt
                 => opt.MapFrom(p => p.ProblemGroupId))
             .ForMember(pam => pam.MemoryLimit, opt
                 => opt.MapFrom(p => p.MemoryLimit))
             .ForMember(pam => pam.TimeLimit, opt
                 => opt.MapFrom(p => p.TimeLimit))
             .ForMember(pam => pam.SubmissionTypesInProblems, opt
                 => opt.Ignore())
             .ForMember(pam => pam.ProblemGroup, opt
                 => opt.Ignore())
             .ForMember(pam => pam.Checker, opt
                 => opt.Ignore())
             .ForMember(pam => pam.SolutionSkeleton, opt
                 => opt.Ignore())
             .ForMember(pam => pam.AdditionalFiles, opt
                 => opt.Ignore())
             .ForMember(pam => pam.Tests, opt
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
                 => opt.Ignore());
    }
}

public class ProblemAdministrationModelValidator : BaseValidator<ProblemAdministrationModel>
{
    public ProblemAdministrationModelValidator()
    {
        this.RuleFor(model => model.Name)
            .Length(1, ConstraintConstants.Problem.NameMaxLength);
        this.RuleFor(model => model.TimeLimit)
            .GreaterThanOrEqualTo(0);
        this.RuleFor(model => model.MemoryLimit)
            .GreaterThanOrEqualTo(0);
        this.RuleFor(model => model.SourceCodeSizeLimit)
            .GreaterThanOrEqualTo(0);
        this.RuleFor(model => model.MaximumPoints)
            .GreaterThanOrEqualTo((short)0);
        this.RuleFor(model => model.SubmissionTypes.Count)
            .GreaterThanOrEqualTo(1);
        this.RuleFor(model => model.ContestId)
            .GreaterThanOrEqualTo(0);

        //TODO: check uploaded files.
    }
}
