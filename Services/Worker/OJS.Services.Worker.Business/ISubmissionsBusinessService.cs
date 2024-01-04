namespace OJS.Services.Worker.Business;

using OJS.Services.Common.Models.Submissions;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface ISubmissionsBusinessService : IService
{
    Task<ExecutionResultServiceModel> ExecuteSubmission(SubmissionServiceModel submission);
}