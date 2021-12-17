using System;

namespace OJS.Servers.Ui.Models.Submissions
{
    using OJS.Services.Ui.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System.Collections.Generic;
    using OJS.Servers.Ui.Models.Submissions.Profile;

    public class SubmissionForProfileResponseModel : IMapFrom<SubmissionServiceModel>
    {
        public int Id { get; set; }

        public DateTime SubmittedOn { get; set; }

        public ProblemResponseModel Problem { get; set; }

        public string SubmissionTypeName { get; set; }

        public int Points { get; set; }

        public IEnumerable<TestRunResponseModel> TestRuns { get; set; }
    }
}