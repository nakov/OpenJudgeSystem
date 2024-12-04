namespace OJS.Services.Common.Models.Contests;

public interface IContestActivityServiceModel
{
    int Id { get; set; }

    string? Name { get; set; }

    bool IsVisible { get; set; }

    bool CanBeCompeted { get; set; }

    bool CanBePracticed { get; set; }

    ParticipantActivityServiceModel? CompeteUserActivity { get; set; }

    ParticipantActivityServiceModel? PracticeUserActivity { get; set; }
}