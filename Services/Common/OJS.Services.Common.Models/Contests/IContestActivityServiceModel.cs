namespace OJS.Services.Common.Models.Contests;

public interface IContestActivityServiceModel
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public bool CanBeCompeted { get; set; }

    public bool CanBePracticed { get; set; }
}