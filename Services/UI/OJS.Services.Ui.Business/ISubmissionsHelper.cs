namespace OJS.Services.Ui.Business;

using OJS.Services.Infrastructure;
using OJS.Services.Ui.Models.Submissions;

public interface ISubmissionsHelper : IService
{
    bool IsEligibleForRetest(SubmissionDetailsServiceModel detailsModel);
}