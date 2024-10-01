namespace OJS.Web.Areas.Administration.ViewModels.ContestCategory
{
    using System.ComponentModel.DataAnnotations;

    using static OJS.Common.Constants.EditorTemplateConstants;

    using Resource = Resources.Areas.Administration.ContestCategories.ViewModels.ContestsImportViewModel;

    public class ImportContestsViewModel
    {
        public int CategoryId { get; set; }

        public string CategoryName { get; set; }

        [Display(Name = "Contest_ids", ResourceType = typeof(Resource))]
        [Required(ErrorMessageResourceName = "Contest_ids_required_error_message", ErrorMessageResourceType = typeof(Resource))]
        [UIHint(MultiLineText)]
        [RegularExpression(
            "^\\d+(?:[\\s,]*\\d+)*",
            ErrorMessageResourceName = "Contest_ids_regex_error_message",
            ErrorMessageResourceType = typeof(Resource))]
        public string ContestIdsToImport { get; set; }

        [Display(Name = "Ojs_platform_url", ResourceType = typeof(Resource))]
        [Required(ErrorMessageResourceName = "Ojs_platform_url_required_error_message", ErrorMessageResourceType = typeof(Resource))]
        [MinLength(10, ErrorMessageResourceName = "Ojs_platform_url_min_length_error_message", ErrorMessageResourceType = typeof(Resource))]
        [UIHint(SingleLineText)]
        public string OjsPlatformUrl { get; set; }

        [Display(Name = "Replace_existing_contests", ResourceType = typeof(Resource))]
        public bool ReplaceExistingContests { get; set; }

        [Display(Name = "Api_key", ResourceType = typeof(Resource))]
        [Required(ErrorMessageResourceName = "Api_key_required_error_message", ErrorMessageResourceType = typeof(Resource))]
        [UIHint(SingleLineText)]
        public string ApiKey { get; set; }
    }
}