namespace OJS.Services.Infrastructure.BackgroundJobs
{
    using SoftUni.Services.Infrastructure;
    using System;
    using System.Linq.Expressions;

    public interface IHangfireBackgroundJobsService : IService
    {
        object AddFireAndForgetJob<T>(Expression<Action<T>> methodCall);

        void AddOrUpdateRecurringJob(object recurringJobId, Expression<Action> methodCall, string cronExpression);

        void AddOrUpdateRecurringJob<T>(object recurringJobId, Expression<Action<T>> methodCall, string cronExpression);

        void OnSucceededStateContinueWith<T>(string parentJobId, Expression<Action<T>> methodCall);
    }
}