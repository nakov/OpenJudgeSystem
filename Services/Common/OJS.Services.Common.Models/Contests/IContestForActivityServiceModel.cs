namespace OJS.Services.Common.Models.Contests;

using OJS.Common.Enumerations;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

public interface IContestForActivityServiceModel : IMapFrom<Contest>
{
    int Id { get; set; }

    ContestType Type { get; set; }

    bool IsVisible { get; set; }

    bool IsDeleted { get; set; }

    DateTime? StartTime { get; set; }

    DateTime? EndTime { get; set; }

    DateTime? PracticeStartTime { get; set; }

    DateTime? PracticeEndTime { get; set; }
}