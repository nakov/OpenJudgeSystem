namespace OJS.Services.Common.Models.Contests;

public class ContestActivityServiceModel : IContestActivityServiceModel
{
    public bool CanBeCompeted { get; set; }

    public bool CanBePracticed { get; set; }

    public bool IsActive { get; set; }
}