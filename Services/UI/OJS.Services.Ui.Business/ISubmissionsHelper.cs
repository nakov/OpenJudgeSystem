namespace OJS.Services.Ui.Business;

using System.Threading.Tasks;
using OJS.Services.Infrastructure;
using OJS.Services.Ui.Models.Submissions;

public interface ISubmissionsHelper : IService
{
    Task<bool> IsEligibleForRetest(SubmissionDetailsServiceModel detailsModel);
}