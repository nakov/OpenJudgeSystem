namespace OJS.Services.Common.Models;

using System;
using System.Linq.Expressions;
using SoftUni.Services.Infrastructure;

public class RecurringBackgroundJob<TBusinessServiceType>
    where TBusinessServiceType : IService
{
    protected RecurringBackgroundJob(string queueName)
    {
        this.Name = this.GetType().Name;
        this.Queue = queueName.ToLowerInvariant();
    }

    /// <summary>
    /// Gets a Hangfire queue name to which the job is registered in the application server.
    /// </summary>
    protected string Queue { get; }

    /// <summary>
    /// Gets or sets the name by which the job will be distinguished in the dashboard UI.
    /// </summary>
    protected string Name { get; set; }

    /// <summary>
    /// Gets or sets a cron expression indicating the jobs' frequency of execution.
    /// </summary>
    protected string Cron { get; set; } = null!;

    /// <summary>
    /// Gets or sets a method containing the logic that will be executed by the job.
    /// </summary>
    protected Expression<Action<TBusinessServiceType>> MethodCall { get; set; } = null!;
}