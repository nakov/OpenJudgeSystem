namespace OJS.Services.Ui.Business.Validation;

using OJS.Services.Common.Validation;
using OJS.Services.Ui.Models.Submissions;
using OJS.Services.Common.Models.Users;

public interface ISubmissionFileDownloadValidationService : IValidationService<(SubmissionDetailsServiceModel, UserInfoModel)>
{
}