namespace OJS.Services.Administration.Models.Participants;

public class ChangeParticipationTimeModel
{
    public int ContestId { get; set; }

    public string ContestName { get; set; } = string.Empty;

    public int TimeInMinutes { get; set; }
}