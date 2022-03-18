using System.Linq;

namespace OJS.Services.Ui.Models.Submissions
{
    using System;
    using OJS.Data.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System.Collections.Generic;

    public class SubmissionServiceModel : IMapFrom<Submission>
    {
        public int Id { get; set; }

        public ProblemServiceModel Problem { get; set; } = null!;

        public int Points { get; set; }

        public IEnumerable<TestRunServiceModel> TestRuns { get; set; } = Enumerable.Empty<TestRunServiceModel>();
    }
}