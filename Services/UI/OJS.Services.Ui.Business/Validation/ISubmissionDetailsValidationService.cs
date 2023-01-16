namespace OJS.Services.Ui.Business.Validation;

using OJS.Services.Common.Models.Users;
using OJS.Services.Ui.Models.Submissions;

using OJS.Services.Common.Validation;

public interface ISubmissionDetailsValidationService : IValidationServiceAsync<(SubmissionDetailsServiceModel, UserInfoModel)>
{
}