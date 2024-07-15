namespace OJS.Services.Common.Filters;

using Hangfire.Common;
using Hangfire.States;
using OJS.Services.Common.Exceptions;

public class MessageBusExceptionFilter : JobFilterAttribute, IElectStateFilter
{
    public void OnStateElection(ElectStateContext context)
    {
        var failedState = context.CandidateState as FailedState;

        if (failedState?.Exception is MessageBusNotHealthyException)
        {
            context.CandidateState = new DeletedState()
            {
                Reason = failedState.Exception.Message,
            };
        }
    }
}