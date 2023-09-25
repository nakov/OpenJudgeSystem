namespace OJS.Servers.Ui.Models;
using System.Collections.Generic;
using Submissions.Details;
using Submissions.Results;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionDetailsWIthResultsResponseModel : IMapFrom<SubmissionDetailsWithResultsModel>
{
    public SubmissionDetailsResponseModel? SubmissionDetails { get; set; }
    public IEnumerable<SubmissionResultsResponseModel>? SubmissionResults { get; set; }
}