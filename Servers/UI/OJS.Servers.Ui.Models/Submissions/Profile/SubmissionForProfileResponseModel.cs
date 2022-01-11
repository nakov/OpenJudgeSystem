using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Servers.Ui.Models.Submissions.Profile
{
    using System;
    using System.Collections.Generic;
    using OJS.Services.Ui.Models.Submissions;

    public class SubmissionForProfileResponseModel : IMapFrom<SubmissionForProfileServiceModel>
    {
        public int Id { get; set; }

        public DateTime SubmittedOn { get; set; }

        public ProblemResponseModel Problem { get; set; }

        public string SubmissionTypeName { get; set; }

        public int Points { get; set; }

        public IEnumerable<TestRunResponseModel> TestRuns { get; set; }

        public double MaxUsedTime { get; set; }

        public double MaxUsedMemory { get; set; }
    }
}