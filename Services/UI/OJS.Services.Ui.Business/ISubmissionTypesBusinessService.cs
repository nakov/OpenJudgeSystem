using OJS.Data.Models.Problems;
using OJS.Services.Ui.Models.SubmissionTypes;
using SoftUni.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OJS.Services.Ui.Business;

public interface ISubmissionTypesBusinessService : IService
{
    Task<SubmissionTypeServiceModel> GetById(int id);

    Task<IEnumerable<SubmissionTypeServiceModel>> GetAllowedSubmissionTypes(int problemId);

    public Task<IEnumerable<SubmissionTypeFilterServiceModel>> GetAllOrderedByUsage();

    void ValidateSubmissionType(int submissionTypeId, Problem problem, bool shouldAllowBinaryFiles = false);
}