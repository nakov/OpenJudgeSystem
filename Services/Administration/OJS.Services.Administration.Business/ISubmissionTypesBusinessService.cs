namespace OJS.Services.Administration.Business;

using System.Threading.Tasks;
using SoftUni.Services.Infrastructure;
using OJS.Services.Administration.Models.SubmissionTypes;
using System.Collections.Generic;

public interface ISubmissionTypesBusinessService : IService
{
    Task<List<SubmissionTypesInProblemView>> GetForProblem();
}