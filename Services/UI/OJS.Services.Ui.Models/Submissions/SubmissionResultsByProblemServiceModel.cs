namespace OJS.Services.Ui.Models.Submissions;

using OJS.Services.Common.Models;
using System.Collections.Generic;

public class SubmissionResultsByProblemServiceModel
{
    public IEnumerable<SubmissionResultsServiceModel>? SubmissionResults { get; set; }

    public ValidationResult ValidationResult { get; set; } = null!;
}