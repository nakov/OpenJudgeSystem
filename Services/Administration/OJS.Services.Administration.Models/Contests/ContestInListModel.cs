namespace OJS.Services.Administration.Models.Contests;

using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

public class ContestInListModel : IMapFrom<Contest>
{
    public int Id { get; set; }

    public string? Category { get; set; }

    public string? Name { get; set; }

    public bool AllowParallelSubmissionsInTasks { get; set; }

    public bool AutoChangeTestsFeedbackVisibility { get; set; }

    public int? CategoryId { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public string? ContestPassword { get; set; }

    public string? Description { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsVisible { get; set; }

    public int LimitBetweenSubmissions { get; set; }
}