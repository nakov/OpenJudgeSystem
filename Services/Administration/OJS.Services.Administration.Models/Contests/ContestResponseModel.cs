namespace OJS.Services.Administration.Models.Contests;

using AutoMapper;
using OJS.Common.Enumerations;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;
using OJS.Data.Models;
using System.Collections.Generic;
public class ContestResponseModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public ContestType Type { get; set; }

    public int? CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public DateTime? PracticeStartTime { get; set; }

    public DateTime? PracticeEndTime { get; set; }

    public int LimitBetweenSubmissions { get; set; }

    public bool IsVisible { get; set; }

    public string? NewIpPassword { get; set; }

    public bool AllowParallelSubmissionsInTasks { get; set; }

    public bool AutoChangeTestsFeedbackVisibility { get; set; }

    public double OrderBy { get; set; }

    // TODO : Add Automatically change test detailed feedback visiblity and Warn on missing author solutions
    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<Contest, ContestResponseModel>()
            .ForMember(crm => crm.Id, opt
                => opt.MapFrom(c => c.Id))
            .ForMember(crm => crm.Name, opt
                => opt.MapFrom(c => c.Name))
            .ForMember(crm => crm.Type, opt
                => opt.MapFrom(c => c.Type))
            .ForMember(crm => crm.CategoryId, opt
                => opt.MapFrom(c => c.CategoryId))
            .ForMember(crm => crm.CategoryName, opt
                => opt.MapFrom(c => c.Category!.Name))
            .ForMember(crm => crm.Description, opt
                => opt.MapFrom(c => c.Description))
            .ForMember(crm => crm.StartTime, opt
                => opt.MapFrom(c => c.StartTime))
            .ForMember(crm => crm.EndTime, opt
                => opt.MapFrom(c => c.EndTime))
            .ForMember(crm => crm.PracticeStartTime, opt
                => opt.MapFrom(c => c.PracticeStartTime))
            .ForMember(crm => crm.PracticeEndTime, opt
                => opt.MapFrom(c => c.PracticeEndTime))
            .ForMember(crm => crm.LimitBetweenSubmissions, opt
                => opt.MapFrom(c => c.LimitBetweenSubmissions))
            .ForMember(crm => crm.IsVisible, opt
                => opt.MapFrom(c => c.IsVisible))
            .ForMember(crm => crm.NewIpPassword, opt
                => opt.MapFrom(c => c.NewIpPassword))
            .ForMember(crm => crm.AllowParallelSubmissionsInTasks, opt
                => opt.MapFrom(c => c.AllowParallelSubmissionsInTasks))
            .ForMember(crm => crm.AutoChangeTestsFeedbackVisibility, opt
                => opt.MapFrom(c => c.AutoChangeTestsFeedbackVisibility))
            .ForMember(crm => crm.OrderBy, opt
                => opt.MapFrom(c => c.OrderBy));
}