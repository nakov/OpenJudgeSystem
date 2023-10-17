namespace OJS.Servers.Ui.Models.Submissions.Results;

using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;
public class SubmissionViewInResultsResponseModel : IMapFrom<SubmissionViewInResultsPageModel>
{
    public int Id { get; set; }

    public string SubmissionType { get; set; } = null!;

    public int Points { get; set; }

    public short MaximumPoints { get; set; }

    public DateTime CreatedOn { get; set; }

    public bool IsProcessed { get; set; }

    public int TestRunsCount { get; set; }
}