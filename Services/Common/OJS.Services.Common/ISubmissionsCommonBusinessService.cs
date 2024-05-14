namespace OJS.Services.Common;

using OJS.Services.Common.Models.Submissions.ExecutionContext;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Services.Infrastructure;

public interface ISubmissionsCommonBusinessService : IService
{
    Task PublishSubmissionForProcessing(SubmissionServiceModel submission);

    Task PublishSubmissionsForProcessing(IEnumerable<SubmissionServiceModel> submissions);
}