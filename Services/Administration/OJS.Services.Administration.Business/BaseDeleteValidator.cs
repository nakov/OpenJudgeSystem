namespace OJS.Services.Administration.Business;

using FluentValidation;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Validation;
public class BaseDeleteValidator<TModel> : BaseValidator<TModel>
    where TModel : BaseDeleteValidationModel
{
    public BaseDeleteValidator() =>
        this.RuleFor(model => model.Id)
            .GreaterThan(0)
            .WithMessage("Cannot delete entity with invalid id.");
}