namespace OJS.Services.Common;

using OJS.Services.Common.Models.Submissions.ExecutionContext;
using System.Collections.Generic;
using OJS.Services.Infrastructure;
using System.Threading.Tasks;

public interface ISubmissionPublisherService : IService
{
    Task Publish(SubmissionServiceModel submission);

    Task PublishRetest(int id);

    Task PublishMultiple(IEnumerable<SubmissionServiceModel> submissions);
}