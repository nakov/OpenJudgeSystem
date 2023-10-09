namespace OJS.Services.Ui.Models.Submissions;

using SoftUni.Common.Models;

public class SubmissionDetailsWithResultsModel
{
    public SubmissionDetailsServiceModel? SubmissionDetails { get; set; }

    public PagedResult<SubmissionViewInResultsPageModel>? SubmissionResults { get; set; }
}