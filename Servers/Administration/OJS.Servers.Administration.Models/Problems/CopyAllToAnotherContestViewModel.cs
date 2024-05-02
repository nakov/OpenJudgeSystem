namespace OJS.Servers.Administration.Models.Problems;

using AutoMapper;
using Microsoft.AspNetCore.Mvc.Rendering;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Infrastructure.Models.Mapping;
using System.ComponentModel.DataAnnotations;
using Resource = OJS.Common.Resources.CopyProblem;

public class CopyAllToAnotherContestViewModel : IMapFrom<ContestCopyProblemsValidationServiceModel>
{
    [IgnoreMap]
    public int FromContestId { get; set; }

    [IgnoreMap]
    public SelectList? ContestsToCopyTo { get; set; }

    [Display(Name = Resource.BulkCopyContestLabel)]
    [Required(ErrorMessage = Resource.ContestRequired)]
    public int? Id { get; set; }

    public string? Name { get; set; }
}