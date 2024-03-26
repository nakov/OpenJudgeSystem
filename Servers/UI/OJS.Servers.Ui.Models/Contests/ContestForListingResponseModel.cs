namespace OJS.Servers.Ui.Models.Contests;

using OJS.Services.Ui.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

public class ContestForListingResponseModel : IMapFrom<ContestForListingServiceModel>
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public DateTime? PracticeStartTime { get; set; }

    public DateTime? PracticeEndTime { get; set; }

    public bool CanBeCompeted { get; set; }

    public bool CanBePracticed { get; set; }

    public string Category { get; set; } = null!;

    public int NumberOfProblems { get; set; }

    public int CompeteResults { get; set; }

    public int PracticeResults { get; set; }

    public int ContestCompeteMaximumPoints { get; set; }

    public int ContestPracticeMaximumPoints { get; set; }

    public int CompeteResult { get; set; }

    public int PracticeResult { get; set; }
}
