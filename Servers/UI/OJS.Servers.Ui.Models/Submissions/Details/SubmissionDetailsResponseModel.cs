namespace OJS.Servers.Ui.Models.Submissions.Details
{
    using System;
    using System.Collections.Generic;
    using OJS.Servers.Ui.Models.Submissions.Profile;
    using OJS.Servers.Ui.Models.Users;
    using OJS.Services.Ui.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public class SubmissionDetailsResponseModel : IMapFrom<SubmissionDetailsServiceModel>
    {
        public int Id { get; set; }

        public ProblemResponseModel Problem { get; set; } = null!;

        public int Points { get; set; }

        public string? Content { get; set; }

        public IEnumerable<TestRunDetailsResponseModel> TestRuns { get; set; } = null!;

        public UserProfileResponseModel User { get; set; } = null!;

        public SubmissionTypeForSubmissionDetailsResponseModel SubmissionType { get; set; } = null!;

        public double MaxUsedTime { get; set; }

        public double MaxUsedMemory { get; set; }

        public bool IsOfficial { get; set; }

        public bool IsCompiledSuccessfully { get; set; }

        public string CompilerComment { get; set; } = null!;

        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }
    }
}