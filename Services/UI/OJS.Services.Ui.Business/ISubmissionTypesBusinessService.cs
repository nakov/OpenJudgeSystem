using OJS.Services.Ui.Models.SubmissionTypes;
using SoftUni.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OJS.Services.Ui.Business;

public interface ISubmissionTypesBusinessService : IService
{
    public Task<IEnumerable<SubmissionTypeServiceModel>> GetAllowedSubmissionTypes(int problemId);
}