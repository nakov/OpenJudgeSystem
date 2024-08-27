namespace OJS.Services.Ui.Models.Submissions
{
    using AutoMapper;
    using FluentExtensions.Extensions;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Infrastructure.Models.Mapping;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class SubmissionForProfileServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public DateTime CreatedOn { get; set; }

        public string StrategyName { get; set; } = null!;

        public bool IsOfficial { get; set; }

        public ProblemForPublicSubmissionsServiceModel Problem { get; set; } = null!;

        public ResultForPublicSubmissionsServiceModel Result { get; set; } = null!;

        public int PageNumber { get; set; }

        public bool IsCompiledSuccessfully { get; set; }

        public long? MaxMemoryUsed { get; set; }

        public int? MaxTimeUsed { get; set; }

        public bool Processed { get; set; }

        public IEnumerable<TestRunServiceModel> TestRuns { get; set; } = Enumerable.Empty<TestRunServiceModel>();

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<Submission, SubmissionForProfileServiceModel>()
                .ForMember(
                    x => x.StrategyName,
                    opt => opt.MapFrom(
                        y => y.SubmissionType!.Name))
                .ForMember(
                    x => x.Problem,
                    opt => opt.MapFrom(
                        y => y.Problem))
                .ForMember(
                    x => x.Result,
                    opt => opt.MapFrom(
                        y => y))
                .ForMember(
                    x => x.Result,
                    opt => opt.MapFrom(
                        y => new ResultForPublicSubmissionsServiceModel
                        {
                            Points = y.Points,
                            MaxPoints =
                                y.Problem.IsNull()
                                    ? 0
                                    : y.Problem!.MaximumPoints,
                        }))
                .ForMember(
                    x => x.IsOfficial,
                    opt => opt.MapFrom(
                        y => y.Participant!.IsOfficial))
                .ForMember(
                    x => x.PageNumber,
                    opt => opt.Ignore())
                .ForMember(
                    d => d.MaxMemoryUsed,
                    opt => opt.MapFrom(s =>
                        s.TestRuns.Count() != 0 ? s.TestRuns.Max(testRun => testRun.MemoryUsed) : (long?)null))
                .ForMember(
                    d => d.MaxTimeUsed,
                    opt => opt.MapFrom(s =>
                        s.TestRuns.Count() != 0 ? s.TestRuns.Max(testRun => testRun.TimeUsed) : (int?)null));
    }
}