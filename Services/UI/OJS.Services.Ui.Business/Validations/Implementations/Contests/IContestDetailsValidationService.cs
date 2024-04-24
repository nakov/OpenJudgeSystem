namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Models.Users;
using OJS.Services.Common.Validation;

public interface IContestDetailsValidationService : IValidationService<(Contest?, bool)>
{
}