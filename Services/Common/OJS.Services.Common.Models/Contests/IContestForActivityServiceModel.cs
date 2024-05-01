namespace OJS.Services.Common.Models.Contests;

using AutoMapper;
using OJS.Common.Enumerations;
using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;
using System;
using System.ComponentModel.DataAnnotations.Schema;

public interface IContestForActivityServiceModel : IMapFrom<Contest>
{
    int Id { get; set; }

    string? Name { get; set; }

    ContestType Type { get; set; }

    bool IsVisible { get; set; }

    bool IsDeleted { get; set; }

    DateTime? StartTime { get; set; }

    DateTime? EndTime { get; set; }

    DateTime? PracticeStartTime { get; set; }

    DateTime? PracticeEndTime { get; set; }

    [IgnoreMap]
    bool IsOnline { get; }
}