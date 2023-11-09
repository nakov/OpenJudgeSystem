namespace OJS.Services.Common.Models.Contests;

public interface ICanBeCompetedAndPracticed
{
    public int Id { get; set; }

    public bool CanBeCompeted { get; set; }

    public bool CanBePracticed { get; set; }
}