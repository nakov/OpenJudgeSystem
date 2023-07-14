using OJS.Data.Models.Submissions;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

namespace OJS.Services.Common;

public interface ISubmissionPublisherService : IService
{
    Task Publish(Submission submission);
}