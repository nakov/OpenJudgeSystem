namespace OJS.Services.Ui.Models.Users
{
    using AutoMapper;
    using OJS.Data.Models.Users;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class UserProfileServiceModel : IMapExplicitly
    {
        public string Id { get; set; } = string.Empty;

        public string UserName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? City { get; set; }

        public byte? Age { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<UserProfile, UserProfileServiceModel>()
                .ForMember(
                    dest => dest.FirstName,
                    opt => opt.MapFrom(src => src.UserSettings.FirstName))
                .ForMember(
                    dest => dest.LastName,
                    opt => opt.MapFrom(src => src.UserSettings.LastName))
                .ForMember(
                    dest => dest.Age,
                    opt => opt.MapFrom(src => src.UserSettings.Age))
                .ForMember(
                    dest => dest.City,
                    opt => opt.MapFrom(src => src.UserSettings.City));
    }
}