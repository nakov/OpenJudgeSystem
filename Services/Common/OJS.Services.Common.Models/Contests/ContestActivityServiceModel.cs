namespace OJS.Services.Common.Models.Contests;

public class ContestActivityServiceModel : IContestActivityServiceModel
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public bool IsVisible { get; set; }

    public bool CanBeCompeted { get; set; }

    public bool CanBePracticed { get; set; }

    public ParticipantActivityServiceModel? CompeteUserActivity { get; set; }

    public ParticipantActivityServiceModel? PracticeUserActivity { get; set; }
}