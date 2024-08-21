namespace OJS.Services.Administration.Business.SubmissionTypes;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models.SubmissionTypes;
using OJS.Services.Administration.Models.SubmissionTypesInSubmissionDocuments;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ISubmissionTypesBusinessService : IAdministrationOperationService<SubmissionType, int, SubmissionTypeAdministrationModel>
{
    Task<List<SubmissionTypesInProblemView>> GetForProblem();

    Task<List<SubmissionTypeInDocument>> GetForDocument();

    Task<bool> AllExist(IEnumerable<SubmissionTypeInSubmissionDocumentAdministrationModel> submissionTypes);

    Task<bool> ExistsById(int submissionTypeId);
}