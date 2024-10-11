namespace OJS.Services.Administration.Models.Participants;

public class ChangeParticipationTimeForSingleParticipantModel : ChangeParticipationTimeModel
{
    public string UserId { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;
}