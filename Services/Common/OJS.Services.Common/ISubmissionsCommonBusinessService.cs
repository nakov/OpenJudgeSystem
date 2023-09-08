namespace OJS.Services.Common;

using System.Threading.Tasks;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using SoftUni.Services.Infrastructure;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;

public interface ISubmissionsCommonBusinessService : IService
{
    Task PublishSubmissionForProcessing(SubmissionServiceModel submission);
}