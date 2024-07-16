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

    public SelectList? ContestsToCopyTo { get; set; }

    [Display(Name = Resource.ContestLabel)]
    [Required(ErrorMessage = Resource.ContestRequired)]
    public int? ToContestId { get; set; }

    public string? ToContestName { get; set; }

    public int FromProblemId { get; set; }

    public string? FromProblemName { get; set; }

    [Display(Name = Resource.ProblemGroupLabel)]
    public int ToProblemGroupId { get; set; }

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
                opt => opt.MapFrom(src => src.ProblemGroup.Contest.Name))
            .ForMember(m => m.ContestsToCopyTo, opt => opt.Ignore())
            .ForMember(m => m.ToContestId, opt => opt.Ignore())
            .ForMember(m => m.ToContestName, opt => opt.Ignore())
            .ForMember(m => m.ToProblemGroupId, opt => opt.Ignore())
            .ForMember(m => m.ProblemGroupsToCopyTo, opt => opt.Ignore());

        configuration
            .CreateMap<CopyToAnotherContestViewModel, ContestCopyProblemsValidationServiceModel>()
            .ForMember(
                m => m.Id,
                opt => opt.MapFrom(src => src.ToContestId))
            .ForMember(m => m.Name, opt => opt.Ignore());
    }
}