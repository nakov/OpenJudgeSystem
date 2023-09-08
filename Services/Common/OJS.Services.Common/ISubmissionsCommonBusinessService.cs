namespace OJS.Services.Common;

using System.Threading.Tasks;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using SoftUni.Services.Infrastructure;

public interface ISubmissionsCommonBusinessService : IService
{
    Task PublishSubmissionForProcessing(SubmissionServiceModel submission);
}