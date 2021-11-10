namespace OJS.Services.Infrastructure.BackgroundJobs.Implementations
{
    using Hangfire;
    using System;
    using System.Linq.Expressions;

    public class HangfireBackgroundJobsService : IHangfireBackgroundJobsService
    {
        public object AddFireAndForgetJob<T>(Expression<Action<T>> methodCall)
            => BackgroundJob.Enqueue(methodCall);

        public void AddOrUpdateRecurringJob(
            object recurringJobId,
            Expression<Action> methodCall,
            string cronExpression)
            => RecurringJob.AddOrUpdate((string)recurringJobId, methodCall, cronExpression);

        public void AddOrUpdateRecurringJob<T>(
            object recurringJobId,
            Expression<Action<T>> methodCall,
            string cronExpression)
            => RecurringJob.AddOrUpdate((string)recurringJobId, methodCall, cronExpression);

        public void OnSucceededStateContinueWith<T>(
            string parentJobId,
            Expression<Action<T>> methodCall)
            => BackgroundJob.ContinueJobWith(parentJobId, methodCall, JobContinuationOptions.OnlyOnSucceededState);
    }
}