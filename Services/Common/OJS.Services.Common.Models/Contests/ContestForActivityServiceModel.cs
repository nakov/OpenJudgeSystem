namespace OJS.Services.Common.Models.Contests;

using OJS.Common.Enumerations;
using System;

public class ContestForActivityServiceModel : IContestForActivityServiceModel
{
    public int Id { get; set; }

    public ContestType Type { get; set; }

    public bool IsVisible { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public DateTime? PracticeStartTime { get; set; }

    public DateTime? PracticeEndTime { get; set; }
}