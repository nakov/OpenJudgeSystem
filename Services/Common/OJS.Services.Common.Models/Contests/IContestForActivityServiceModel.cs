namespace OJS.Services.Common.Models.Contests;

using OJS.Common.Enumerations;
using System;

public interface IContestForActivityServiceModel
{
    int Id { get; set; }

    string Name { get; set; }

    ContestType Type { get; set; }

    bool IsVisible { get; set; }

    DateTime? VisibleFrom { get; set; }

    bool IsDeleted { get; set; }

    DateTime? StartTime { get; set; }

    DateTime? EndTime { get; set; }

    DateTime? PracticeStartTime { get; set; }

    DateTime? PracticeEndTime { get; set; }
}