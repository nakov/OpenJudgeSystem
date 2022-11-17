namespace OJS.Services.Ui.Models.Submissions
{
    using AutoMapper;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Ui.Models.Users;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System.Collections.Generic;
    using System.Linq;

    public class SubmissionDetailsServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public ProblemServiceModel Problem { get; set; } = null!;

        public int Points { get; set; }

        public string? Content { get; set; }

        public IEnumerable<TestRunDetailsServiceModel> TestRuns { get; set; } =
            Enumerable.Empty<TestRunDetailsServiceModel>();

        public UserProfileServiceModel User { get; set; } = null!;

        public double MaxUsedTime { get; set; }

        public double MaxUsedMemory { get; set; }

        public SubmissionTypeForSubmissionDetailsServiceModel SubmissionType { get; set; } = null!;

        public bool IsOfficial { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<Submission, SubmissionDetailsServiceModel>()
                .ForMember(s => s.User, opt => opt.MapFrom(s => s.Participant!.User))
                .ForMember(d => d.MaxUsedMemory, opt => opt.MapFrom(source =>
                    source.TestRuns.Any()
                        ? source.TestRuns.Max(tr => tr.MemoryUsed)
                        : 0.0))
                .ForMember(d => d.MaxUsedTime, opt => opt.MapFrom(source =>
                    source.TestRuns.Any()
                        ? source.TestRuns.Max(tr => tr.TimeUsed)
                        : 0.0))
                .ForMember(d => d.Content, opt => opt.MapFrom(s =>
                    s.IsBinaryFile
                        ? null
                        : s.ContentAsString))
                .ForMember(d => d.IsOfficial, opt => opt.MapFrom(s =>
                    s.Participant!.IsOfficial));
    }
}