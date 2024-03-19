namespace OJS.Common.Extensions;

using FluentValidation;
using System;

public static class RuleBuilderExtensions
{
    public static IRuleBuilderOptions<T, string?> MustBeValidEnum<T, TEnum>(this IRuleBuilder<T, string?> ruleBuilder)
        where TEnum : Enum
        => ruleBuilder.Must(BeValidEnum<TEnum>).WithMessage($"The provided {nameof(TEnum)} is invalid.");

    private static bool BeValidEnum<T>(string? value)
        where T : Enum
    {
        var isValid = Enum.TryParse(typeof(T), value, out _);

        if (isValid)
        {
            return true;
        }

        return false;
    }
}