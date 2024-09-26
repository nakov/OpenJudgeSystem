namespace OJS.Web.Areas.Administration.ViewModels.ContestCategory
{
    using System.ComponentModel.DataAnnotations;

    using static OJS.Common.Constants.EditorTemplateConstants;

    public class ImportContestsViewModel
    {
        public int CategoryId { get; set; }

        public string CategoryName { get; set; }

        [Display(Name = "Contest IDs to Import")]
        [Required(ErrorMessage = "Please enter the contest IDs to import.")]
        [UIHint(MultiLineText)]
        [RegularExpression(
            "^\\d+(?:[\\s,]*\\d+)*",
            ErrorMessage = "Please enter a comma or space-separated list of contest IDs.")]
        public string ContestIdsToImport { get; set; }

        [Display(Name = "OJS Platform URL")]
        [Required(ErrorMessage = "Please enter the OJS Platform URL.")]
        [MinLength(10, ErrorMessage = "The OJS Platform URL must be at least 10 characters long.")]
        [UIHint(SingleLineText)]
        public string OjsPlatformUrl { get; set; }

        [Display(Name = "Replace existing contests by matching their Name")]
        public bool ReplaceExistingContests { get; set; }
    }
}