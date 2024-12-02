namespace OJS.Services.Common.Models.Contests;

public interface IContestActivityServiceModel
{
    int Id { get; set; }

    string? Name { get; set; }

    bool CanBeCompeted { get; set; }

    bool CanBePracticed { get; set; }
}