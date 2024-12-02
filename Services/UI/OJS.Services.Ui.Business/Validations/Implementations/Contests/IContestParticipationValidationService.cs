namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Models.Users;
using OJS.Services.Common.Validation;
using OJS.Services.Ui.Models.Contests;

public interface IContestParticipationValidationService : IValidationServiceAsync<(ContestParticipationValidationServiceModel?, ContestCategoryServiceModel?, IParticipantForActivityServiceModel? participant, UserInfoModel?, bool)>
{
}