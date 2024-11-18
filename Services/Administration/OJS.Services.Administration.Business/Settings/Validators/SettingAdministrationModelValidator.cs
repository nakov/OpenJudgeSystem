namespace OJS.Services.Administration.Business.Settings.Validators;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Data.Models;
using OJS.Services.Administration.Models.Settings;
using OJS.Services.Common.Data;
using OJS.Services.Common.Validation;
using System;
using System.Globalization;
using FluentValidation.Results;
using static OJS.Common.GlobalConstants.Settings;

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
            .WithMessage("The value does not match the setting type.")
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(model => model)
            .Custom(ValidateMentorSetting)
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);
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

    private static void ValidateMentorSetting(
        SettingAdministrationModel model,
        ValidationContext<SettingAdministrationModel> context)
    {
        if (model.Name is null || !model.Name.StartsWith(Mentor, StringComparison.Ordinal))
        {
            return;
        }

        if (model.Type is nameof(SettingType.Numeric) && !ValidateNumericMentorSetting(model, out var upperBound))
        {
            context.AddFailure(new ValidationFailure(
                nameof(model.Value),
                $"The setting '{model.Name}' could not be applied to the Mentor. The value is '{model.Value}', but it must be between 0 and {upperBound} (inclusive)."));
        }
        else if (model is { Type: nameof(SettingType.ShortString) } or { Type: nameof(SettingType.LongString) } && !ValidateStringMentorSetting(model))
        {
            context.AddFailure(new ValidationFailure(
                nameof(model.Value),
                $"The setting '{model.Name}' has an invalid value '{model.Value}'. Valid options are: {string.Join(", ", Enum.GetNames(typeof(OpenAIModels)))}."));
        }
    }

    private static bool ValidateStringMentorSetting(SettingAdministrationModel model)
        => model.Name switch
        {
            MentorModel => Enum.TryParse<OpenAIModels>(model.Value, out _),
            _ => false,
        };

    private static bool ValidateNumericMentorSetting(
        SettingAdministrationModel model,
        out int upperBound)
    {
        upperBound = model.Name switch
        {
            nameof(MentorMessagesSentCount) => MentorMessagesSentCount,
            nameof(MentorMaxInputTokenCount) => MentorMaxInputTokenCount,
            nameof(MentorMaxOutputTokenCount) => MentorMaxOutputTokenCount,
            nameof(MentorQuotaLimit) => MentorQuotaLimit,
            nameof(MentorQuotaResetTimeInMinutes) => MentorQuotaResetTimeInMinutes,
            _ => -1,
        };

        var value = int.Parse(model.Value!, CultureInfo.InvariantCulture);

        return value >= 0 && value <= upperBound;
    }
}