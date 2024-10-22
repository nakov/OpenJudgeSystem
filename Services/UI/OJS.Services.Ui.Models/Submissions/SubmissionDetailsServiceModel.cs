namespace OJS.Services.Ui.Models.Submissions
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using AutoMapper;
    using OJS.Data.Models.Submissions;
    using OJS.Data.Models.Tests;
    using OJS.Services.Ui.Models.Users;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class SubmissionDetailsServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public ProblemServiceModel Problem { get; set; } = null!;

        public int Points { get; set; }

        public string? Content { get; set; }

        public IEnumerable<TestRunDetailsServiceModel> TestRuns { get; set; } = [];

        public UserServiceModel User { get; set; } = null!;

        public double MaxUsedTime { get; set; }

        public double MaxUsedMemory { get; set; }

        public short MaxPoints { get; set; }

        public SubmissionTypeForSubmissionDetailsServiceModel SubmissionType { get; set; } = null!;

        public bool IsOfficial { get; set; }

        public bool IsCompiledSuccessfully { get; set; }

        public bool IsProcessed { get; set; }

        public bool IsEligibleForRetest { get; set; }

        public bool UserIsInRoleForContest { get; set; }

        public string? CompilerComment { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public byte[]? ByteContent { get; set; }

        public string? FileExtension { get; set; }

        public DateTime? StartedExecutionOn { get; set; }

        public DateTime? CompletedExecutionOn { get; set; }

        public string? WorkerName { get; set; }

        public string? ProcessingComment { get; set; }

        public int TotalTests => this.Tests.Count();

        public int ContestId { get; set; }

        public string? ContestName { get; set; }

        public int ContestCategoryId { get; set; }

        public IEnumerable<Test> Tests { get; set; } = [];

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<Submission, SubmissionDetailsServiceModel>()
                .ForMember(d => d.MaxUsedMemory, opt => opt.MapFrom(source =>
                    source.TestRuns.Count != 0
                        ? source.TestRuns.Max(tr => tr.MemoryUsed)
                        : 0.0))
                .ForMember(d => d.MaxUsedTime, opt => opt.MapFrom(source =>
                    source.TestRuns.Count != 0
                        ? source.TestRuns.Max(tr => tr.TimeUsed)
                        : 0.0))
                .ForMember(d => d.Content, opt => opt.MapFrom(s =>
                    s.IsBinaryFile
                        ? null
                        : s.ContentAsString))
                .ForMember(d => d.IsOfficial, opt => opt.MapFrom(s => s.Participant.IsOfficial))
                .ForMember(d => d.ByteContent, opt => opt.MapFrom(s => s.Content))
                .ForMember(s => s.IsProcessed, opt => opt.MapFrom(s => s.Processed))
                .ForMember(d => d.Tests, opt => opt.MapFrom(s => s.Problem.Tests))
                .ForMember(d => d.ContestId, opt => opt.MapFrom(s => s.Problem.ProblemGroup.ContestId))
                .ForMember(d => d.ContestName, opt => opt.MapFrom(s => s.Problem.ProblemGroup.Contest.Name))
                .ForMember(d => d.ContestCategoryId, opt => opt.MapFrom(s => s.Problem.ProblemGroup.Contest.CategoryId))
                .ForMember(d => d.MaxPoints, opt => opt.MapFrom(s => s.Problem.MaximumPoints))
                .ForMember(d => d.TotalTests, opt => opt.Ignore())
                .ForMember(s => s.UserIsInRoleForContest, opt => opt.Ignore())
                .ForMember(s => s.IsEligibleForRetest, opt => opt.Ignore())
                .ForMember(s => s.User, opt => opt.Ignore());
    }
}