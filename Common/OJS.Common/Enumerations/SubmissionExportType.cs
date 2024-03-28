namespace OJS.Common.Enumerations
{
    using System.ComponentModel.DataAnnotations;

    public enum SubmissionExportType
    {
        [Display(Name = "All submission")]
        AllSubmissions = 1,

        [Display(Name = "Best submission")]
        BestSubmissions = 2,

        [Display(Name = "Latest submissions")]
        LastSubmissions = 3,
    }
}