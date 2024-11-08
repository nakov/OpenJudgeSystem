namespace OJS.Services.Worker.Business;

using OJS.Workers.Common;
using OJS.Services.Infrastructure;

public interface IExecutionStrategyFactory : ISingletonService
{
    IExecutionStrategy CreateExecutionStrategy(IOjsSubmission submission);
}