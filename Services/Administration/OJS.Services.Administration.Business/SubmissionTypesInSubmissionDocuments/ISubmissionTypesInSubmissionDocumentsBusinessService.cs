namespace OJS.Services.Administration.Business.SubmissionTypesInSubmissionDocuments;

using OJS.Data.Models;
using OJS.Services.Administration.Models.SubmissionTypesInSubmissionDocuments;
using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ISubmissionTypesInSubmissionDocumentsBusinessService : IService
{
    Task DeleteByIdAndSubmissionTypeId(int submissionTypeDocumentId, int submissionTypeId);

    Task<bool> IsLastSubmissionType(int submissionTypeDocumentId);

    Task<IEnumerable<SubmissionTypeInSubmissionDocument>> GetAllBySubmissionTypeDocumentId(int submissionTypeDocumentId);

    Task<IEnumerable<SubmissionTypeInSubmissionDocumentInViewModel>> GetAllBySubmissionTypeIds(IEnumerable<int> submissionTypeIds);

    void Delete(SubmissionTypeInSubmissionDocument submissionTypeInSubmissionDocument);
}