namespace OJS.Services.Common;

using OJS.Data.Models.Submissions;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface ISubmissionPublisherService : IService
{
    Task Publish(Submission submission);
}