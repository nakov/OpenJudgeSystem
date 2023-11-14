namespace OJS.Common.Helpers;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

public static class SettingsHelper
{
    public static void ValidateSettings(string settingName, object? settingInstance)
    {
        if (settingInstance == null)
        {
            throw new ArgumentNullException(
                nameof(settingInstance),
                $"{settingName} cannot be null. Ensure it is added to the appSettings or environment variables.");
        }

        var validationResults = new List<ValidationResult>();

        var isValid = Validator.TryValidateObject(
            settingInstance,
            new ValidationContext(settingInstance),
            validationResults,
            validateAllProperties: true);

        if (isValid)
        {
            return;
        }

        var message = $"Invalid configuration for {settingName}:"
          + string.Join(string.Empty, validationResults.Select(r => Environment.NewLine + r.ErrorMessage));

        throw new ArgumentException(message, settingName);
    }
}