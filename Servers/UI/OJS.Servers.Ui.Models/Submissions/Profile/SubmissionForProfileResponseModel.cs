namespace OJS.Servers.Ui.Models.Submissions.Profile
{
    using System;
    using System.Collections.Generic;
    using OJS.Services.Ui.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public class SubmissionForProfileResponseModel : IMapFrom<SubmissionForProfileServiceModel>
    {
        public int Id { get; set; }

        public DateTime SubmittedOn { get; set; }

        public ProblemResponseModel Problem { get; set; } = null!;

        public string SubmissionTypeName { get; set; } = null!;

        public int Points { get; set; }

        public IEnumerable<TestRunResponseModel> TestRuns { get; set; } = null!;

        public double MaxUsedTime { get; set; }

        public double MaxUsedMemory { get; set; }
    }
}