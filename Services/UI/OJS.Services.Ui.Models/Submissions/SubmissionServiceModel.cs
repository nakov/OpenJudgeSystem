﻿namespace OJS.Services.Ui.Models.Submissions
{
    using System;
    using OJS.Data.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using AutoMapper;
    using System.Collections.Generic;

    public class SubmissionServiceModel : IMapExplicitly
    {
        public int Id { get; set; }

        public DateTime SubmittedOn { get; set; }

        public ProblemServiceModel Problem { get; set; } = null!;

        public string SubmissionTypeName { get; set; } = string.Empty;

        public int Points { get; set; }

        public IEnumerable<TestRunServiceModel> TestRuns { get; set; } = ArraySegment<TestRunServiceModel>.Empty;

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<Submission, SubmissionServiceModel>()
                .ForMember(d => d.SubmittedOn, opt => opt.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.SubmissionTypeName, opt => opt.MapFrom(s => s.SubmissionType!.Name));
    }
}