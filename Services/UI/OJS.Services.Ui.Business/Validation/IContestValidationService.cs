
using OJS.Data.Models.Contests;
using OJS.Services.Common.Validation;

namespace OJS.Services.Ui.Business.Validation;

public interface IContestValidationService : IValidationServiceAsync<(Contest, string, bool, bool)>
{
}