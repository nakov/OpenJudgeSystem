namespace OJS.Services.Ui.Business.Implementations;

using System.Linq;
using OJS.Services.Ui.Models.Submissions;

public class SubmissionsHelper : ISubmissionsHelper
{
    public bool IsEligibleForRetest(SubmissionDetailsServiceModel detailsModel)
        => (detailsModel.Tests.Any() && !detailsModel.TestRuns.Any()) &&
           detailsModel.IsProcessed && detailsModel.IsCompiledSuccessfully &&
           (detailsModel.ProcessingComment == null);
}