

namespace OJS.Services.Ui.Models.Submissions
{
    using OJS.Data.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using AutoMapper;
    using System.Collections.Generic;
    using System;
    using System.Linq;

    public class SubmissionServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public DateTime SubmittedOn { get; set; }

        public ProblemServiceModel Problem { get; set; }

        public string SubmissionTypeName { get; set; }

        public int Points { get; set; }

        public IEnumerable<TestRunServiceModel> TestRuns { get; set; }

        public double MaxUsedTime { get; set; }

        public double MaxUsedMemory { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<Submission, SubmissionServiceModel>()
                .ForMember(d => d.SubmittedOn, opt => opt.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.SubmissionTypeName, opt => opt.MapFrom(s => s.SubmissionType.Name))
                .ForMember(d => d.MaxUsedTime,
                    opt => opt.MapFrom(s =>
                        s.TestRuns.Any() ? Math.Round(s.TestRuns.Select(x => x.TimeUsed).Max() / 1000.0d, 3) : 0))
                .ForMember(d => d.MaxUsedMemory,
                    opt => opt.MapFrom(s =>
                        s.TestRuns.Any()
                            ? Math.Round(s.TestRuns.Select(x => x.MemoryUsed).Max() / 1024d / 1024d, 3)
                            : 0));
    }
}