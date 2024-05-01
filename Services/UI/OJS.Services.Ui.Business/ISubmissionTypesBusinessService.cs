namespace OJS.Services.Ui.Business;

using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Data.Models.Problems;
using OJS.Services.Ui.Models.SubmissionTypes;
using OJS.Services.Infrastructure;
using OJS.Data.Models;

public interface ISubmissionTypesBusinessService : IService
{
    Task<SubmissionTypeServiceModel> GetById(int id);

    Task<IEnumerable<SubmissionTypeServiceModel>> GetAllowedSubmissionTypes(int problemId);

    Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllOrderedByLatestUsage();

    void ValidateSubmissionType(int submissionTypeId, Problem problem, bool shouldAllowBinaryFiles = false);
}