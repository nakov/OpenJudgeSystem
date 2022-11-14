namespace OJS.Services.Ui.Models.Contests;

public class ContestValidationModel
{
    public bool ContestIsFound { get; set; } = true;

    public bool ContestCanBeCompeted { get; set; } = true;

    public bool ContestCanBePracticed { get; set; } = true;

    public bool ContestIsNotExpired { get; set; } = true;

    public bool IsParticipantRegistered { get; set; } = true;

    public string ErrorMessage { get; set; }
}