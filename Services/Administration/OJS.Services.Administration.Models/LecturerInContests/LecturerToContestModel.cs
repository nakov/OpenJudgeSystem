namespace OJS.Services.Administration.Models.LecturerInContests;

using OJS.Common.Enumerations;

public class LecturerToContestModel
{
    public string? LecturerId { get; set; }

    public int ContestId { get; set; }

    public CrudOperationType OperationType { get; set; }
}