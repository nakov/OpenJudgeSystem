namespace OJS.Web.Areas.Contests.Models
{
    using System.ComponentModel;

    public enum SubmissionExportType
    {
        [Description("All submission")]
        AllSubmissions = 1,

        [Description("Best submission")]
        BestSubmissions = 2,

        [Description("Latest submissions")]
        LastSubmissions = 3,
    }
}