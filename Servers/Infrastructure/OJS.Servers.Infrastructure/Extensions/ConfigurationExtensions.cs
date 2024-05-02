namespace OJS.Servers.Infrastructure.Extensions;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.Extensions.Configuration;
using OJS.Services.Infrastructure.Configurations;

public static class ConfigurationExtensions
{
    public static TValue GetSectionValueWithValidation<TConfig, TValue>(this IConfiguration configuration, string key)
        where TConfig : BaseConfig
    {
        var section = configuration.GetSection<TConfig>();
        var value = section.GetValue<TValue>(key);
        var config = section.Get<TConfig>();
        ValidateConfigProperty(config.SectionName, config, key, value);
        return value;
    }

    public static TConfig GetSectionWithValidation<TConfig>(this IConfiguration configuration)
        where TConfig : BaseConfig
    {
        var config = configuration.GetSection<TConfig>().Get<TConfig>();
        ValidateConfig(config.SectionName, config);
        return config;
    }

    private static IConfigurationSection GetSection<TSection>(this IConfiguration configuration)
        where TSection : BaseConfig
    {
        var instance = Activator.CreateInstance<TSection>();
        var sectionName = instance.SectionName;
        return configuration.GetSection(sectionName);
    }

    private static void ValidateConfig(string name, object? instance)
    {
        if (instance == null)
        {
            throw new ArgumentNullException(
                nameof(instance),
                $"{name} cannot be null. Ensure it is added to the appSettings or environment variables.");
        }

        var validationResults = new List<ValidationResult>();

        var isValid = Validator.TryValidateObject(
            instance,
            new ValidationContext(instance),
            validationResults,
            validateAllProperties: true);

        if (isValid)
        {
            return;
        }

        var message = $"Invalid configuration for {name}:"
          + string.Join(string.Empty, validationResults.Select(r => Environment.NewLine + r.ErrorMessage));

        throw new ArgumentException(message, name);
    }

    private static void ValidateConfigProperty(
        string configName,
        object? configInstance,
        string propertyName,
        object? propertyValue)
    {
        if (configInstance == null)
        {
            throw new ArgumentNullException(
                nameof(configInstance),
                $"{configName} cannot be null. Ensure it is added to the appSettings or environment variables.");
        }

        var validationResults = new List<ValidationResult>();

        var isValid = Validator.TryValidateProperty(
            propertyValue,
            new ValidationContext(configInstance)
            {
                MemberName = propertyName,
            },
            validationResults);

        if (isValid)
        {
            return;
        }

        var message = $"Invalid configuration value for {configName}:"
            + string.Join(string.Empty, validationResults.Select(r => Environment.NewLine + r.ErrorMessage));

        throw new ArgumentException(message, configName);
    }
}