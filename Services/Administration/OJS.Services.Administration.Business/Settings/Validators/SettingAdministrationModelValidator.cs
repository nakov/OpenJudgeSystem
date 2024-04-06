namespace OJS.Services.Administration.Business.Settings.Validators;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Data.Models;
using OJS.Services.Administration.Models.Settings;
using OJS.Services.Common.Data;
using OJS.Services.Common.Validation;

public class SettingAdministrationModelValidator : BaseAdministrationModelValidator<SettingAdministrationModel, int, Setting>
{
    public SettingAdministrationModelValidator(IDataService<Setting> dataService)
        : base(dataService)
    {
        this.RuleFor(x => x.Name)
            .NotEmpty()
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(model => model.Type)
            .MustBeValidEnum<SettingAdministrationModel, SettingType>()
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(model => model.Value)
            .NotEmpty()
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);
    }
}