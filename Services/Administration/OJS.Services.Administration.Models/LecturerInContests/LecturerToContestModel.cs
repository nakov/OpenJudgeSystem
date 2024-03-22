namespace OJS.Services.Administration.Models.LecturerInContests;

using OJS.Common.Enumerations;

public class LecturerToContestModel
{
    public string? LecturerId { get; set; }

    public int ContestId { get; set; }

    public CrudOperationTypes OperationType { get; set; }
}