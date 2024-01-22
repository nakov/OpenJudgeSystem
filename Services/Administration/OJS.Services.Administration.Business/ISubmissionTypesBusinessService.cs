namespace OJS.Services.Administration.Business;

using OJS.Data.Models;
using System.Threading.Tasks;
using SoftUni.Services.Infrastructure;

public interface ISubmissionTypesBusinessService : IService
{
    Task<SubmissionTypeInProblem> GetForProblem();
}