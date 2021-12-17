namespace OJS.Services.Ui.Models.Users
{
    using OJS.Data.Models.Users;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using AutoMapper;

    public class UserProfileServiceModel : IMapExplicitly
    {
        public string Id { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<UserProfile, UserProfileServiceModel>()
                .ForMember(
                    dest => dest.FirstName,
                    opt => opt.MapFrom(src => (src.UserSettings.FirstName)))
                .ForMember(
                    dest => dest.LastName,
                    opt => opt.MapFrom(src => (src.UserSettings.LastName)));
    }
}