namespace OJS.Services.Ui.Business.Validation;

using Models.Submissions;
using OJS.Services.Common.Models.Users;
using OJS.Services.Common.Validation;

public interface ISubmissionResultsValidationService : IValidationService<(UserInfoModel, ProblemForSubmissionDetailsServiceModel?, ParticipantSubmissionResultsServiceModel?, bool)>
{
}