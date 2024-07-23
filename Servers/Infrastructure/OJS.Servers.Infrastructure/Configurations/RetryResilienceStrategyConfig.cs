namespace OJS.Servers.Infrastructure.Configurations;

using Polly;
using OJS.Services.Infrastructure.Configurations;
using System;
using System.ComponentModel.DataAnnotations;

public class RetryResilienceStrategyConfig : BaseConfig
{
    public override string SectionName => "RetryResilienceStrategy";

    /// <summary>
    /// Gets or sets the maximum number of retry attempts.
    /// The operation will be attempted up to 3 times before considering it a failure.
    /// </summary>
    [Required]
    public int MaxRetryAttempts { get; set; }

    /// <summary>
    /// Gets or sets the initial delay between retry attempts.
    /// The first retry will wait for 1 second before executing.
    /// </summary>
    [Required]
    public TimeSpan Delay { get; set; }

    /// <summary>
    /// Gets or sets the way the delay changes between retry attempts.
    /// Valid options: Constant, Linear, Exponential.
    /// Exponential means the delay increases exponentially with each attempt, etc.
    /// For example: 1s, 2s, 4s for the three attempts.
    /// </summary>
    [ValidBackoffDelayType]
    [Required]
    public DelayBackoffType BackoffType { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether a randomized number should be added to the delay between retry attempts.
    /// When true, the actual delay will be the calculated delay plus or minus a small random amount.
    /// This helps prevent the "thundering herd" problem in distributed systems.
    /// Example: If 'Delay' is set to 1 and 'Jitter' is true, the actual value of 'Delay' will vary,
    /// it could be between 0.8 - 1.2 / 0.6 - 1.1 / 0.9 - 1.05, etc. ( depends on the implementation ).
    /// </summary>
    [Required]
    public bool UseJitter { get; set; }

    private class ValidBackoffDelayTypeAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
        {
            if (value is DelayBackoffType backoffType && Enum.IsDefined(typeof(DelayBackoffType), backoffType))
            {
                return ValidationResult.Success!;
            }

            return new ValidationResult($"Invalid BackoffDelayType value. The possible values are: {string.Join(", ", Enum.GetNames(typeof(DelayBackoffType)))}");
        }
    }
}