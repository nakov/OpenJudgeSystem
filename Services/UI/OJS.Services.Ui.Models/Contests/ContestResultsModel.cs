namespace OJS.Services.Ui.Models.Contests;

using OJS.Data.Models.Contests;

public class ContestResultsModel
{
    public Contest Contest { get; set; } = new Contest();

    public bool Official { get; set; }

    public bool IsUserAdminOrLecturer { get; set; }

    public bool IsFullResults { get; set; }

    public int? TotalResultsCount { get; set; }

    public bool IsExportResults { get; set; } = false;

    public int Page { get; set; } = 1;

    public int ItemsInPage { get; set; } = int.MaxValue;
}