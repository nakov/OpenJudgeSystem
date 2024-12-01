namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Services.Common.Validation;
using OJS.Services.Ui.Models.Contests;

public interface IContestResultsValidationService : IValidationServiceAsync<(ContestDetailsServiceModel?, bool fullResults, bool isOfficial)>
{
}