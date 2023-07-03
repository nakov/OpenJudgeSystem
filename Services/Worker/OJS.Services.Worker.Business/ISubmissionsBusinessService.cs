namespace OJS.Services.Worker.Business;

using OJS.Services.Worker.Models.ExecutionContext;
using OJS.Services.Worker.Models.ExecutionResult;
using SoftUni.Services.Infrastructure;

public interface ISubmissionsBusinessService : IService
{
    ExecutionResultServiceModel ExecuteSubmission(
        SubmissionServiceModel submission,
        string userId);
}