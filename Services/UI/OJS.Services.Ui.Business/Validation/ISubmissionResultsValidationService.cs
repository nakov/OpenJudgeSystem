namespace OJS.Services.Ui.Business.Validation;

using OJS.Data.Models.Participants;
using OJS.Data.Models.Problems;
using OJS.Services.Common.Models.Users;
using OJS.Services.Common.Validation;

public interface ISubmissionResultsValidationService : IValidationService<(UserInfoModel, Problem?, Participant?, bool)>
{
}