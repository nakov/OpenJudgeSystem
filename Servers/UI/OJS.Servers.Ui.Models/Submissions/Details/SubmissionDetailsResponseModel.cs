using OJS.Servers.Ui.Models.Submissions.Profile;
using OJS.Servers.Ui.Models.Users;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;
using System.Collections.Generic;

namespace OJS.Servers.Ui.Models.Submissions.Details
{
    public class SubmissionDetailsResponseModel : IMapFrom<SubmissionDetailsServiceModel>
    {
        public int Id { get; set; }

        public ProblemResponseModel Problem { get; set; }

        public int Points { get; set; }

        public string? Content { get; set; }

        public IEnumerable<TestRunDetailsResponseModel> TestRuns { get; set; }

        public UserProfileResponseModel User { get; set; }

        public SubmissionTypeForSubmissionDetailsResponseModel SubmissionType { get; set; }

        public double MaxUsedTime { get; set; }

        public double MaxUsedMemory { get; set; }

        public bool IsOfficial { get; set; }

        public bool IsCompiledSuccessfully { get; set; }

        public string CompilerComment { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }
    }

    public class
        SubmissionTypeForSubmissionDetailsResponseModel : IMapFrom<SubmissionTypeForSubmissionDetailsServiceModel>
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}