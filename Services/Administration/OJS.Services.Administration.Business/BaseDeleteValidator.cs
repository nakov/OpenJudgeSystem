namespace OJS.Services.Administration.Business;

using FluentValidation;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Validation;

public class BaseDeleteValidator<TModel, TId> : BaseValidator<TModel>
    where TModel : BaseDeleteValidationModel<TId>
{
    public BaseDeleteValidator()
    {
        if (typeof(TId) == typeof(int?) || typeof(TId) == typeof(int))
        {
            this.RuleFor(model => model.Id as int?)
                .GreaterThan(0)
                .WithMessage("Cannot delete entity with invalid id.");
        }

        if (typeof(TId) == typeof(string))
        {
            this.RuleFor(model => model.Id as string)
                .NotEmpty();
        }
    }
}