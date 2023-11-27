namespace OJS.Services.Administration.Business.Validation.Implementations;

using OJS.Services.Administration.Models;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation;

using GlobalResource = OJS.Common.Resources.ProblemsController;

public class ProblemValidationService : IValidationService<ProblemValidationServiceModel>
{
    public ValidationResult GetValidationResult(ProblemValidationServiceModel? model)
    {
        if (model!.TimeLimit <= 0)
        {
            return ValidationResult.Invalid(GlobalResource.TimeLimitMustBePositive);
        }

        if (model.MemoryLimit <= 0)
        {
            return ValidationResult.Invalid(GlobalResource.MemoryLimitMustBePositive);
        }

        return ValidationResult.Valid();
    }
}