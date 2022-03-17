using OJS.Servers.Ui.Models.Submissions.Profile;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;
using System.Collections.Generic;

namespace OJS.Servers.Ui.Models.Submissions.Results;

public class SubmissionResultsResponseModel : IMapFrom<SubmissionResultsServiceModel>
{
    public int Id { get; set; }

    public int ProblemId { get; set; }

    public DateTime CreatedOn { get; set; }

    public bool IsProcessed { get; set; }

    public bool IsCompiledSuccessfully { get; set; }

    public bool IsOfficial { get; set; }

    public int Points { get; set; }

    public short MaximumPoints { get; set; }

    public IEnumerable<TestRunResponseModel> TestRuns { get; set; } = ArraySegment<TestRunResponseModel>.Empty;
}