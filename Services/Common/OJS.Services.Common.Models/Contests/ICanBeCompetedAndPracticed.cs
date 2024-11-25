namespace OJS.Services.Common.Models.Contests;

public interface ICanBeCompetedAndPracticed
{
    int Id { get; set; }

    bool CanBeCompeted { get; set; }

    bool CanBePracticed { get; set; }
}