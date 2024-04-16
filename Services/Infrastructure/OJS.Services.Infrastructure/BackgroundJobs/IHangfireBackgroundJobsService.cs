namespace OJS.Services.Infrastructure.BackgroundJobs
{
    using SoftUni.Services.Infrastructure;
    using System;
    using System.Linq.Expressions;

    public interface IHangfireBackgroundJobsService : IService
    {
        object AddFireAndForgetJob<T>(Expression<Action<T>> methodCall, string queueName);

        /// <summary>
        /// A method that adds or updates a recurring job.
        /// </summary>
        /// <param name="recurringJobId">The name by which the job will be distinguished.</param>
        /// <param name="methodCall">A method containing the logic that will be executed by the job.</param>
        /// <param name="cronExpression">Cron expression indicating the frequency of execution of the job.</param>
        /// <param name="queue">Hangfire queue to which the job is registered. Use application name for now.</param>
        void AddOrUpdateRecurringJob(object recurringJobId, Expression<Action> methodCall, string cronExpression, string queue);

        /// <summary>
        /// A method that adds or updates a recurring job.
        /// </summary>
        /// <param name="recurringJobId">The name by which the job will be distinguished.</param>
        /// <param name="methodCall">A method containing the logic that will be executed by the job.</param>
        /// <param name="cronExpression">Cron expression indicating the frequency of execution of the job.</param>
        /// <param name="queue">Hangfire queue to which the job is registered. Use application name for now.</param>
        void AddOrUpdateRecurringJob<T>(object recurringJobId, Expression<Action<T>> methodCall, string cronExpression, string queue);

        void OnSucceededStateContinueWith<T>(string parentJobId, Expression<Action<T>> methodCall);
    }
}