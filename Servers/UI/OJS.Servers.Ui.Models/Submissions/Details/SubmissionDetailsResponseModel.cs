using OJS.Servers.Ui.Models.Submissions.Profile;
using OJS.Servers.Ui.Models.Users;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;

namespace OJS.Servers.Ui.Models.Submissions.Details
{
    public class SubmissionDetailsResponseModel : IMapFrom<SubmissionDetailsServiceModel>
    {
        public int Id { get; set; }

        public ProblemResponseModel Problem { get; set; }

        public int Points { get; set; }

        public IEnumerable<TestRunDetailsResponseModel> TestRuns { get; set; }

        public UserProfileResponseModel User { get; set; }

        public double MaxUsedTime { get; set; }

        public double MaxUsedMemory { get; set; }
    }
}