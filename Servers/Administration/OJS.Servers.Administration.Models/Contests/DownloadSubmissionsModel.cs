namespace OJS.Servers.Administration.Models.Contests
{
    using OJS.Common.Enumerations;
    using System.ComponentModel.DataAnnotations;

    public class DownloadSubmissionsModel
    {
        public int ContestId { get; set; }

        public ContestExportResultType ContestExportResultType { get; set; }

        [Range(2, int.MaxValue)]
        public SubmissionExportType SubmissionExportType { get; set; }
    }
}