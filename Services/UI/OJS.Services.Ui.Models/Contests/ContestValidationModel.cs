namespace OJS.Services.Ui.Models.Contests;

public class ContestValidationModel
{
    public bool ContestIsFound { get; set; }

    public bool ContestCanBeCompeted { get; set; }

    public bool ContestCanBePracticed { get; set; }

    public bool ContestIsExpired { get; set; }

    public bool IsParticipantRegistered { get; set; }
}