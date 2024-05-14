namespace OJS.Services.Ui.Models.Search;

using System;
using OJS.Services.Infrastructure.Models.Mapping;
using AutoMapper;
using OJS.Common.Enumerations;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Models.Contests;

public class ContestSearchServiceModel : IMapExplicitly, ICanBeCompetedAndPracticed, IContestForActivityServiceModel
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

    public bool CanBeCompeted { get; set; }

    public bool CanBePracticed { get; set; }

    public string Category { get; set; } = string.Empty;

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Contest, ContestSearchServiceModel>()
            .ForMember(
                dest => dest.Category,
                opt => opt.MapFrom(src => src.Category!.Name))
            .ForMember(d => d.CanBeCompeted, opt => opt.Ignore())
            .ForMember(d => d.CanBePracticed, opt => opt.Ignore());
}