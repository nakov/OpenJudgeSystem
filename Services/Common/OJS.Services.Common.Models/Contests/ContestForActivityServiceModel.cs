namespace OJS.Services.Common.Models.Contests;

using OJS.Common.Enumerations;
using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;
using System;

public class ContestForActivityServiceModel : IMapFrom<Contest>, IContestForActivityServiceModel
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ContestType Type { get; set; }

    public bool IsVisible { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public DateTime? PracticeStartTime { get; set; }

    public DateTime? PracticeEndTime { get; set; }
}