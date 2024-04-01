namespace OJS.Services.Administration.Models.Submissions
{
    using OJS.Common.Enumerations;
    using System.ComponentModel.DataAnnotations;

    public class DownloadSubmissionsModel
    {
        public int ContestId { get; set; }

        public ContestExportResultType ContestExportResultType { get; set; }

        public SubmissionExportType SubmissionExportType { get; set; }
    }
}