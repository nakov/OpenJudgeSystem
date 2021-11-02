namespace OJS.Web.Areas.Administration.InputModels.AntiCheat
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    using OJS.Web.ViewModels.Common;
    using OJS.Workers.Common.Models;

    public class SubmissionSimilarityFiltersInputModel
    {
        [Required]
        [Display(Name = "Contest")]
        public int? ContestId { get; set; }

        [Display(Name = "Detector Type")]
        public PlagiarismDetectorType PlagiarismDetectorType { get; set; }

        public IEnumerable<DropdownViewModel> PlagiarismDetectorTypes { get; set; }
    }
}