namespace OJS.Services.Ui.Models.Contests;

using AutoMapper;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

public class ContestForListingServiceModel
    : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public DateTime? PracticeStartTime { get; set; }

    public DateTime? PracticeEndTime { get; set; }

    public bool CanBeCompeted { get; set; }

    public bool CanBePracticed { get; set; }

    public string Category { get; set; } = string.Empty;

    public int? CategoryId { get; set; }

    public double OrderBy { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Contest, ContestForListingServiceModel>()
            .ForMember(
                dest => dest.Category,
                opt => opt.MapFrom(src => src.Category!.Name));
}