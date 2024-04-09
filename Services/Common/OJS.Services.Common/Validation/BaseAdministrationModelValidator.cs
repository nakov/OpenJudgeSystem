namespace OJS.Services.Common.Validation;

using FluentValidation;
using OJS.Common;
using OJS.Common.Enumerations;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models;
using SoftUni.Data.Infrastructure.Models;

public class BaseAdministrationModelValidator<TAdministrationModel, TId, TEntity> : BaseValidator<TAdministrationModel>
    where TAdministrationModel : BaseAdministrationModel<TId>
    where TEntity : class, IEntity<TId>
{
    private readonly IDataService<TEntity> dataService;

    public BaseAdministrationModelValidator(IDataService<TEntity> dataService)
    {
        this.dataService = dataService;

        this.RuleLevelCascadeMode = CascadeMode.Stop;
        this.ClassLevelCascadeMode = CascadeMode.Stop;

        if (typeof(TId) == typeof(int?) || typeof(TId) == typeof(int))
        {
            this.RuleFor(model => model.Id as int?)
                .GreaterThan(0)
                .WithMessage(GlobalConstants.ErrorMessages.AdministrationModelIdValidationMessage)
                .MustAsync(async (model, _)
                    => await this.dataService.ExistsById(model!))
                .WithMessage(GlobalConstants.ErrorMessages.EntityDoesNotExistMessage)
                .When(model => model.OperationType is CrudOperationType.Read or CrudOperationType.Update or CrudOperationType.Delete);
        }

        if (typeof(TId) == typeof(string))
        {
            this.RuleFor(model => model.Id as string)
                .NotEmpty()
                .WithMessage(GlobalConstants.ErrorMessages.AdministrationModelIdValidationMessage)
                .MustAsync(async (model, _)
                    => await this.dataService.ExistsById(model!))
                .WithMessage(GlobalConstants.ErrorMessages.EntityDoesNotExistMessage)
                .When(model => model.OperationType is CrudOperationType.Read or CrudOperationType.Update or CrudOperationType.Delete);
        }
    }
}