namespace OJS.Servers.Infrastructure.Configurations;

using OJS.Services.Infrastructure.Configurations;
using System;
using System.ComponentModel.DataAnnotations;

public class CircuitBreakerResilienceStrategyConfig : BaseConfig
{
    public override string SectionName => "CircuitBreakerResilienceStrategy";

    /// <summary>
    /// Gets or sets the failure threshold for the circuit breaker, expressed as a decimal between 0 and 1.
    /// If the failure rate exceeds this threshold, the circuit will open.
    /// Example: 0.5 means the circuit opens if 50% or more of requests fail.
    /// </summary>
    [Required]
    [Range(0.0, 1.0)]
    public double FailureRatio { get; set; }

    /// <summary>
    /// Gets or sets the minimum number of requests that must be made before the circuit breaker can open.
    /// This prevents the circuit from tripping prematurely due to a small sample size.
    /// Example: 10 means the circuit won't open unless at least 10 requests have been made.
    /// </summary>
    [Required]
    public int MinimumThroughput { get; set; }

    /// <summary>
    /// Gets or sets the time window (in seconds) during which request failures are tracked.
    /// Older failures outside this window are not considered when deciding to open the circuit.
    /// Example: 30 means only failures within the last 30 seconds are counted.
    /// </summary>
    [Required]
    public TimeSpan SamplingDuration { get; set; }

    /// <summary>
    /// Gets or sets the duration (TimeSpan) for which the circuit remains fully open after tripping.
    /// After this period, a test request is made to see if the underlying issue has been resolved.
    /// If successful, the circuit closes; otherwise, it remains open and another test is scheduled.
    /// </summary>
    [Required]
    public TimeSpan DurationOfBreak { get; set; }
}