namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Services.Common.Models.Users;
using OJS.Services.Common.Validation;
using OJS.Services.Ui.Models.Submissions;

public interface ISubmissionFileDownloadValidationService : IValidationService<(SubmissionFileDetailsServiceModel, UserInfoModel)>
{
}