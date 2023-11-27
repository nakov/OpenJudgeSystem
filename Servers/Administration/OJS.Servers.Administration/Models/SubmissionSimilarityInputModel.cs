namespace OJS.Servers.Administration.Models;

using OJS.Workers.Common.Models;
using System.ComponentModel.DataAnnotations;

public class SubmissionSimilarityInputModel
{
    [Required]
    [Display(Name = "Contest")]
    public int? ContestId { get; set; }

    [Display(Name = "Detector Type")]
    public PlagiarismDetectorType PlagiarismDetectorType { get; set; }
}