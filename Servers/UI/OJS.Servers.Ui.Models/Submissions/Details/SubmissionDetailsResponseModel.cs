namespace OJS.Servers.Ui.Models.Submissions.Details
{
    using OJS.Servers.Ui.Models.Submissions.Profile;
    using OJS.Servers.Ui.Models.Users;
    using OJS.Services.Ui.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System.Collections.Generic;

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
    }
}