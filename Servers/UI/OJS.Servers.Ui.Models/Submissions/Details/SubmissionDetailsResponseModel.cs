using OJS.Servers.Ui.Models.Submissions.Profile;
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

        public IEnumerable<TestRunResponseModel> TestRuns { get; set; }
    }
}