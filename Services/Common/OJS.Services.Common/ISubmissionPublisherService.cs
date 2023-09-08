namespace OJS.Services.Common;

using OJS.Services.Common.Models.Submissions.ExecutionContext;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface ISubmissionPublisherService : IService
{
    Task Publish(SubmissionServiceModel submission);
}