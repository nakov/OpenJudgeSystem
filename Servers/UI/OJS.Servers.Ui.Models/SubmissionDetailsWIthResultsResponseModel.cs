namespace OJS.Servers.Ui.Models;

using SoftUni.Common.Models;
using Submissions.Details;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionDetailsWIthResultsResponseModel : IMapFrom<SubmissionDetailsWithResultsModel>
{
    public SubmissionDetailsResponseModel? SubmissionDetails { get; set; }

    public PagedResult<SubmissionViewInResultsPageModel>? SubmissionResults { get; set; }
}