namespace OJS.Services.Administration.Models.Contests
{
    using OJS.Common.Enumerations;

    public class ContestResultsExportRequestModel
    {
        public int Id { get; set; }

        public ContestExportResultType Type { get; set; }
    }
}