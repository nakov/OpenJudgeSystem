namespace OJS.Servers.Administration.Models.AntiCheat;

using OJS.Services.Administration.Models.AntiCheat;
using SoftUni.AutoMapper.Infrastructure.Models;
using SoftUni.Judge.Common.Enumerations;
using System.ComponentModel.DataAnnotations;

public class SubmissionSimilarityFiltersRequestModel : IMapTo<SubmissionSimilarityFiltersServiceModel>
{
    [Required]
    public int? ContestId { get; set; }

    [Range(1, int.MaxValue)]
    public PlagiarismDetectorType PlagiarismDetectorType { get; set; }
}