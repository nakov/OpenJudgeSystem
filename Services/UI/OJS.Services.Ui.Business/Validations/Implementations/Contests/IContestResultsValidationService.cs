namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Validation;

public interface IContestResultsValidationService : IValidationService<(IContestActivityServiceModel?, bool fullResults, bool isOfficial, bool userIsAdminOrLecturerInContest)>
{
}