using AutoMapper;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace OJS.Services.Ui.Models.Submissions;

public class SubmissionResultsServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public int ProblemId { get; set; }

    public DateTime CreatedOn { get; set; }

    public bool IsProcessed { get; set; }

    public bool IsCompiledSuccessfully { get; set; }

    public bool IsOfficial { get; set; }

    public int Points { get; set; }

    public short MaximumPoints { get; set; }

    public IEnumerable<TestRunServiceModel> TestRuns { get; set; } = Enumerable.Empty<TestRunServiceModel>();

    public string SubmissionType { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Submission, SubmissionResultsServiceModel>()
            .ForMember(d => d.ProblemId, opt => opt.MapFrom(s => s.Problem.Id))
            .ForMember(d => d.MaximumPoints, opt => opt.MapFrom(s => s.Problem.MaximumPoints))
            .ForMember(d => d.IsOfficial, opt => opt.MapFrom(s => s.Participant.IsOfficial))
            .ForMember(d => d.IsProcessed, opt => opt.MapFrom(s => s.Processed))
            .ForMember(d => d.SubmissionType, opt => opt.MapFrom(s => s.SubmissionType.Name));
}