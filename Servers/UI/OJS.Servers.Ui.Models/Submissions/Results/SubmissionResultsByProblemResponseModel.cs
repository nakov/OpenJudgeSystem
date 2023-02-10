namespace OJS.Servers.Ui.Models.Submissions.Results;

using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;

public class SubmissionResultsByProblemResponseModel : IMapFrom<SubmissionResultsByProblemServiceModel>
{
    public IEnumerable<SubmissionResultsResponseModel>? SubmissionResults { get; set; }

    public ValidationResult ValidationResult { get; set; } = null!;
}