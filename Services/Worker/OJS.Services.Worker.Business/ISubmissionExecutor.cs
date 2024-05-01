namespace OJS.Services.Worker.Business
{
    using OJS.Workers.Common;
    using OJS.Services.Infrastructure;
    using System.Threading.Tasks;

    public interface ISubmissionExecutor : IService
    {
        Task<IExecutionResult<TResult>> Execute<TInput, TResult>(OjsSubmission<TInput> submission)
            where TResult : ISingleCodeRunResult, new();
    }
}