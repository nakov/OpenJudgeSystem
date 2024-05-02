namespace OJS.Services.Ui.Business.Validations.Implementations.Submissions;

using OJS.Data.Models.Participants;
using OJS.Data.Models.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using OJS.Services.Common.Validation;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Models.Submissions;

public interface ISubmitSubmissionValidationService : IValidationService
   <(Problem?, UserInfoModel, Participant?, ValidationResult, int, bool, bool, SubmitSubmissionServiceModel)>
{
}