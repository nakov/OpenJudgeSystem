using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;
using System.Collections.Generic;

namespace OJS.Services.Ui.Models.Submissions
{
    public class SubmissionDetailsServiceModel : IMapFrom<Submission>
    {
        public int Id { get; set; }

        public ProblemServiceModel Problem { get; set; } = null!;

        public int Points { get; set; }

        public IEnumerable<TestRunServiceModel> TestRuns { get; set; } = ArraySegment<TestRunServiceModel>.Empty;
    }
}