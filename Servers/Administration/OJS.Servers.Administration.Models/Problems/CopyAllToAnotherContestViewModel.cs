namespace OJS.Servers.Administration.Models.Problems;

using AutoMapper;
using Microsoft.AspNetCore.Mvc.Rendering;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Infrastructure.Models.Mapping;
using System.ComponentModel.DataAnnotations;
using Resource = OJS.Common.Resources.CopyProblem;

public class CopyAllToAnotherContestViewModel : IMapExplicitly
{
    public int FromContestId { get; set; }

    public SelectList? ContestsToCopyTo { get; set; }

    [Display(Name = Resource.BulkCopyContestLabel)]
    [Required(ErrorMessage = Resource.ContestRequired)]
    public int? Id { get; set; }

    public string? Name { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<ContestCopyProblemsValidationServiceModel, CopyAllToAnotherContestViewModel>()
            .ForMember(d => d.FromContestId, opt => opt.Ignore())
            .ForMember(d => d.ContestsToCopyTo, opt => opt.Ignore());
}