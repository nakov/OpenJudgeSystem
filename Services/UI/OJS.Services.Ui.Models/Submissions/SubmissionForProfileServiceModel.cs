using System.Linq;

namespace OJS.Services.Ui.Models.Submissions
{
    using AutoMapper;
    using OJS.Data.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System;
    using System.Collections.Generic;

    public class SubmissionForProfileServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public ProblemServiceModel Problem { get; set; } = null!;

        public int Points { get; set; }

        public IEnumerable<TestRunServiceModel> TestRuns { get; set; } = ArraySegment<TestRunServiceModel>.Empty;

        public DateTime SubmittedOn { get; set; }

        public string SubmissionTypeName { get; set; } = string.Empty;

        public double MaxUsedTime { get; set; }

        public double MaxUsedMemory { get; set; }

        public new void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<Submission, SubmissionForProfileServiceModel>()
                .ForMember(d => d.SubmittedOn, opt => opt.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.SubmissionTypeName, opt => opt.MapFrom(s => s.SubmissionType!.Name))
                .ForMember(d => d.MaxUsedMemory, opt => opt.MapFrom(source =>
                    source.TestRuns.Any()
                        ? source.TestRuns.Max(tr => tr.MemoryUsed)
                        : 0.0))
                .ForMember(d => d.MaxUsedTime, opt => opt.MapFrom(source =>
                        source.TestRuns.Any()
                            ? source.TestRuns.Max(tr => tr.TimeUsed)
                            : 0.0));

    }
}