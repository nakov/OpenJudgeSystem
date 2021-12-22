namespace OJS.Services.Ui.Models.Contests
{
    using System;
    using AutoMapper;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using OJS.Data.Models.Contests;

    public class ContestForHomeIndexServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public DateTime? EndTime { get; set; }

        public bool CanCompete { get; set; }

        public bool CanPractice { get; set; }

        public string Category { get; set; } = string.Empty;

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<Contest, ContestForHomeIndexServiceModel>()
                .ForMember(dest => dest.CanPractice,
                    opt => opt.MapFrom(src => (src.PracticeEndTime.HasValue && src.PracticeStartTime.HasValue)))
                .ForMember(dest => dest.CanCompete,
                    opt => opt.MapFrom(src => (src.StartTime.HasValue && src.EndTime.HasValue)))
                .ForMember(dest => dest.Category,
                    opt => opt.MapFrom(src => src.Category!.Name));
    }
}