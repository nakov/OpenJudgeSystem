namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Validation;

public interface IContestResultsValidationService : IValidationService<(Contest?, bool fullResults, bool isOfficial)>
{
}