namespace OJS.Services.Ui.Models.Submissions
{
    using AutoMapper;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Ui.Models.Users;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class SubmissionFileDetailsServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public UserProfileServiceModel User { get; set; } = null!;

        public byte[]? ByteContent { get; set; }

        public string? FileExtension { get; set; }

        public int ContestId { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<Submission, SubmissionFileDetailsServiceModel>()
                .ForMember(s => s.User, opt => opt.MapFrom(s => s.Participant!.User))
                .ForMember(d => d.ByteContent, opt => opt.MapFrom(s =>
                    s.Content))
                .ForMember(d => d.ContestId, opt => opt.MapFrom(s =>
                    s.Problem != null
                        ? s.Problem.ProblemGroup.ContestId
                        : 0));
    }
}