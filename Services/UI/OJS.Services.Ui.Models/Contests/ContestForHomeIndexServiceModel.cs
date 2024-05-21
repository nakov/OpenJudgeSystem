namespace OJS.Services.Ui.Models.Contests
{
    using System;
    using AutoMapper;
    using OJS.Common.Enumerations;
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Models.Contests;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class ContestForHomeIndexServiceModel : IMapExplicitly, ICanBeCompetedAndPracticed, IContestForActivityServiceModel
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public ContestType Type { get; set; }

        public bool IsVisible { get; set; }

        public DateTime? VisibleFrom { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public DateTime? PracticeStartTime { get; set; }

        public DateTime? PracticeEndTime { get; set; }

        public bool CanBeCompeted { get; set; }

        public bool CanBePracticed { get; set; }

        public bool HasContestPassword { get; set; }

        public bool HasPracticePassword { get; set; }

        public string Category { get; set; } = string.Empty;

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<Contest, ContestForHomeIndexServiceModel>()
                .ForMember(
                    dest => dest.Category,
                    opt => opt.MapFrom(src => src.Category!.Name))
                .ForMember(d => d.CanBePracticed, opt => opt.Ignore())
                .ForMember(d => d.CanBeCompeted, opt => opt.Ignore());
    }
}