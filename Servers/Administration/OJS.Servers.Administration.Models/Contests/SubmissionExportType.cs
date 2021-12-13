namespace OJS.Servers.Administration.Models.Contests
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