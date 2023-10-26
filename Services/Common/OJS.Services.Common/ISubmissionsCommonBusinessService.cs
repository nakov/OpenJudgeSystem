namespace OJS.Services.Common;

using Models.Submissions.ExecutionContext;
using System.Collections.Generic;
using System.Threading.Tasks;
using SoftUni.Services.Infrastructure;

public interface ISubmissionsCommonBusinessService : IService
{
    Task PublishSubmissionForProcessing(SubmissionServiceModel submission);

    Task PublishSubmissionsForProcessing(IEnumerable<SubmissionServiceModel> submissions);
}