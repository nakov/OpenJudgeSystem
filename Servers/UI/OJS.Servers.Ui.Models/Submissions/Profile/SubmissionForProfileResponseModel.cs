namespace OJS.Servers.Ui.Models.Submissions.Profile
{
    using OJS.Services.Ui.Models.Submissions;
    using OJS.Services.Ui.Models.Submissions.PublicSubmissions;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class SubmissionForProfileResponseModel : IMapFrom<SubmissionForProfileServiceModel>
    {
        public int Id { get; set; }

        public DateTime CreatedOn { get; set; }

        public string StrategyName { get; set; } = null!;

        public bool IsOfficial { get; set; }

        public ProblemForPublicSubmissionsServiceModel Problem { get; set; } = null!;

        public ResultForPublicSubmissionsServiceModel Result { get; set; } = null!;

        public StateResultForPublicSubmissionsServiceModel State { get; set; }

        public bool IsCompiledSuccessfully { get; set; }

        public long? MaxMemoryUsed { get; set; }

        public int? MaxTimeUsed { get; set; }

        public bool Processed { get; set; }

        public IEnumerable<TestRunServiceModel> TestRuns { get; set; } = Enumerable.Empty<TestRunServiceModel>();
    }
}