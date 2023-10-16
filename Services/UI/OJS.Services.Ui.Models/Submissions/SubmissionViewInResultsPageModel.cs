namespace OJS.Services.Ui.Models.Submissions;

using AutoMapper;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;
public class SubmissionViewInResultsPageModel : IMapExplicitly
{
    public int Id { get; set; }

    public string SubmissionType { get; set; } = null!;

    public int Points { get; set; }

    public short MaximumPoints { get; set; }

    public DateTime CreatedOn { get; set; }

    public bool IsProcessed { get; set; }

    public int TestRunsCount { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Submission, SubmissionViewInResultsPageModel>()
            .ForMember(
                sm => sm.SubmissionType,
                opt => opt.MapFrom(s => s.SubmissionType!.Name))
            .ForMember(d => d.MaximumPoints, opt => opt.MapFrom(s => s.Problem!.MaximumPoints))
            .ForMember(d => d.IsProcessed, opt => opt.MapFrom(s => s.Processed))
            .ForMember(d => d.TestRunsCount, opt => opt.MapFrom(s => s.TestRuns.Count));
}