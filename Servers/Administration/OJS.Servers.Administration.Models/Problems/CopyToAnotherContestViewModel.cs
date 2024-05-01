namespace OJS.Servers.Administration.Models.Problems;

using AutoMapper;
using Microsoft.AspNetCore.Mvc.Rendering;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Infrastructure.Models.Mapping;
using System.ComponentModel.DataAnnotations;
using Resource = OJS.Common.Resources.CopyProblem;

public class CopyToAnotherContestViewModel : IMapExplicitly
{
    public int FromContestId { get; set; }

    public string? FromContestName { get; set; }

    [IgnoreMap]
    public SelectList? ContestsToCopyTo { get; set; }

    [IgnoreMap]
    [Display(Name = Resource.ContestLabel)]
    [Required(ErrorMessage = Resource.ContestRequired)]
    public int? ToContestId { get; set; }

    [IgnoreMap]
    public string? ToContestName { get; set; }

    public int FromProblemId { get; set; }

    public string? FromProblemName { get; set; }

    [IgnoreMap]
    [Display(Name = Resource.ProblemGroupLabel)]
    public int ToProblemGroupId { get; set; }

    [IgnoreMap]
    public SelectList? ProblemGroupsToCopyTo { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration
            .CreateMap<Problem, CopyToAnotherContestViewModel>()
            .ForMember(
                m => m.FromProblemId,
                opt => opt.MapFrom(src => src.Id))
            .ForMember(
                m => m.FromProblemName,
                opt => opt.MapFrom(src => src.Name))
            .ForMember(
                m => m.FromContestId,
                opt => opt.MapFrom(src => src.ProblemGroup.ContestId))
            .ForMember(
                m => m.FromContestName,
                opt => opt.MapFrom(src => src.ProblemGroup.Contest.Name));

        configuration
            .CreateMap<CopyToAnotherContestViewModel, ContestCopyProblemsValidationServiceModel>()
            .ForMember(
                m => m.Id,
                opt => opt.MapFrom(src => src.ToContestId))
            .ForAllOtherMembers(opt => opt.Ignore());
    }
}