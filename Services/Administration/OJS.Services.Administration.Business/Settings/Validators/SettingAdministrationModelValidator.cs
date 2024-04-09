namespace OJS.Services.Administration.Business.Settings.Validators;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Data.Models;
using OJS.Services.Administration.Models.Settings;
using OJS.Services.Common.Data;
using OJS.Services.Common.Validation;
using System;

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

        this.RuleFor(model => model)
            .NotEmpty()
            .Must(ValueMustMatchType)
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update)
            .WithMessage("The value does not match the setting type.");
    }

    private static bool ValueMustMatchType(SettingAdministrationModel setting)
    {
        var enumValue = Enum.Parse<SettingType>(setting.Type!);

        return enumValue switch
        {
            SettingType.Numeric => int.TryParse(setting.Value, out _),
            SettingType.Boolean => bool.TryParse(setting.Value, out _),
            SettingType.DateTime => DateTime.TryParse(setting.Value, out _),
            _ => true,
        };
    }
}