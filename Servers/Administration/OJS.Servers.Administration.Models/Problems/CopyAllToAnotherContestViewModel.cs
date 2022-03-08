namespace OJS.Servers.Administration.Models.Problems;

using AutoMapper;
using Microsoft.AspNetCore.Mvc.Rendering;
using OJS.Services.Administration.Models.Contests.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.ComponentModel.DataAnnotations;
using Resource = OJS.Common.Resources.CopyProblem;

public class CopyAllToAnotherContestViewModel : IMapFrom<ContestCopyProblemsValidationServiceModel>
{
    [IgnoreMap]
    public int FromContestId { get; set; }

    [IgnoreMap]
    public SelectList? ContestsToCopyTo { get; set; }

    [Display(Name = Resource.Bulk_copy_contest_label)]
    [Required(ErrorMessage = Resource.Contest_required)]
    public int? Id { get; set; }

    public string? Name { get; set; }
}