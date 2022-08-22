using AutoMapper;
using OJS.Common.Extensions.Strings;
using OJS.Services.Ui.Models.Users;
using System.Linq;

namespace OJS.Services.Ui.Models.Submissions
{
    using OJS.Data.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System;
    using System.Collections.Generic;


    public class SubmissionDetailsServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public ProblemServiceModel Problem { get; set; } = null!;

        public int Points { get; set; }

        public string? Content { get; set; }

        public IEnumerable<TestRunDetailsServiceModel> TestRuns { get; set; } =
            Enumerable.Empty<TestRunDetailsServiceModel>();

        public UserProfileServiceModel User { get; set; }

        public double MaxUsedTime { get; set; }

        public double MaxUsedMemory { get; set; }

        public SubmissionTypeForSubmissionDetailsServiceModel SubmissionType { get; set; }

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
                        : s.ContentAsString));
    }
}